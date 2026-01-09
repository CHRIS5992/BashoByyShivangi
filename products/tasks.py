"""
Celery tasks for the products app
Handles asynchronous operations like email sending
"""
from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_custom_order_admin_email(self, order_id, order_number, name, email, phone, 
                                   project_type_display, budget_display, description):
    """
    Send HTML email notification to admin about new custom order
    
    Args:
        order_id: CustomOrder database ID
        order_number: Order number
        name: Customer name
        email: Customer email
        phone: Customer phone
        project_type_display: Human-readable project type
        budget_display: Human-readable budget range
        description: Order description
    """
    try:
        # Context for template
        context = {
            'order_number': order_number,
            'customer_name': name,
            'customer_email': email,
            'customer_phone': phone,
            'project_type': project_type_display,
            'budget': budget_display if budget_display else 'Not specified',
            'description': description,
            'admin_url': f'http://127.0.0.1:8000/admin/products/customorder/{order_id}/',
        }
        
        # Render HTML template
        html_content = render_to_string('emails/admin_notification.html', context)
        
        # Plain text fallback
        text_content = f'''
New Custom Order Received

Order Number: {order_number}
Customer: {name}
Email: {email}
Phone: {phone}
Project Type: {project_type_display}
Budget: {budget_display if budget_display else 'Not specified'}

Description:
{description}

Login to admin panel: http://127.0.0.1:8000/admin/products/customorder/{order_id}/
        '''
        
        # Create email
        subject = f'🔔 New Custom Order: {order_number}'
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.COMPANY_EMAIL,
            to=[settings.COMPANY_EMAIL]
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        
        return f"Admin email sent successfully for order {order_number}"
        
    except Exception as exc:
        # Retry the task if it fails
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_product_order_confirmation_email(self, order_id):
    """
    Send order confirmation email to customer after successful payment
    
    Args:
        order_id: Order database ID
    """
    try:
        from .models import Order
        
        order = Order.objects.get(id=order_id)
        
        # Calculate total items
        total_items = sum(item.quantity for item in order.items.all())
        
        # Context for template
        context = {
            'customer_name': order.customer_name,
            'order_number': order.order_number,
            'order_date': order.created_at.strftime('%B %d, %Y'),
            'order_items': order.items.all(),
            'total_items': total_items,
            'subtotal': order.subtotal,
            'shipping': order.shipping_charge,
            'total_amount': order.total_amount,
            'shipping_address': f"{order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}",
            'customer_phone': order.customer_phone,
            'customer_email': order.customer_email,
            'company_email': settings.COMPANY_EMAIL,
            'company_phone': settings.COMPANY_PHONE,
        }
        
        # Render HTML template
        try:
            html_content = render_to_string('emails/order_confirmation.html', context)
        except:
            # Fallback if template doesn't exist
            html_content = None
        
        # Plain text content
        items_text = '\n'.join([
            f"  - {item.product.name} x {item.quantity} @ ₹{item.product_price} = ₹{item.quantity * item.product_price}"
            for item in order.items.all()
        ])
        
        text_content = f'''
Dear {order.customer_name},

Thank you for your order at Basho By Shivangi!

Order Number: {order.order_number}
Order Date: {order.created_at.strftime('%B %d, %Y')}

Order Items:
{items_text}

Subtotal: ₹{order.subtotal}
Shipping: ₹{order.shipping_charge}
Total Amount: ₹{order.total_amount}

Shipping Address:
{order.shipping_address}
{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}

We will process your order and ship it within 3-5 business days.
You will receive a tracking number once your order is shipped.

If you have any questions, please contact us at:
Email: {settings.COMPANY_EMAIL}
Phone: {settings.COMPANY_PHONE}

Thank you for supporting handcrafted pottery!

With heartfelt appreciation,
BASHO BY SHIVANGI
        '''
        
        # Create email
        subject = f'Order Confirmation - {order.order_number}'
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.COMPANY_EMAIL,
            to=[order.customer_email]
        )
        
        if html_content:
            msg.attach_alternative(html_content, "text/html")
        
        msg.send(fail_silently=False)
        
        return f"Order confirmation email sent to {order.customer_email} for order {order.order_number}"
        
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_product_order_admin_notification(self, order_id):
    """
    Send order notification to admin after successful payment
    
    Args:
        order_id: Order database ID
    """
    try:
        from .models import Order
        
        order = Order.objects.get(id=order_id)
        
        # Calculate total items
        total_items = sum(item.quantity for item in order.items.all())
        
        # Context for template
        context = {
            'order_number': order.order_number,
            'customer_name': order.customer_name,
            'customer_email': order.customer_email,
            'customer_phone': order.customer_phone,
            'order_date': order.created_at.strftime('%B %d, %Y'),
            'order_items': order.items.all(),
            'total_items': total_items,
            'subtotal': order.subtotal,
            'shipping': order.shipping_charge,
            'total_amount': order.total_amount,
            'shipping_address': f"{order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}",
            'payment_status': 'Paid via Razorpay',
            'admin_url': f'http://127.0.0.1:8000/admin/products/order/{order_id}/',
        }
        
        # Render HTML template  
        try:
            html_content = render_to_string('emails/admin_order_notification.html', context)
        except:
            html_content = None
        
        # Plain text content
        items_text = '\n'.join([
            f"  - {item.product.name} x {item.quantity} @ ₹{item.product_price} = ₹{item.quantity * item.product_price}"
            for item in order.items.all()
        ])
        
        text_content = f'''
New Product Order Received

Order Number: {order.order_number}
Order Date: {order.created_at.strftime('%B %d, %Y')}

Customer Details:
Name: {order.customer_name}
Email: {order.customer_email}
Phone: {order.customer_phone}

Order Items ({total_items} items):
{items_text}

Subtotal: ₹{order.subtotal}
Shipping: ₹{order.shipping_charge}
Total Amount: ₹{order.total_amount}

Shipping Address:
{order.shipping_address}
{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}

Payment Status: Paid via Razorpay

View in admin panel: http://127.0.0.1:8000/admin/products/order/{order_id}/
        '''
        
        # Create email
        subject = f'🛒 New Order Received: {order.order_number}'
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.COMPANY_EMAIL,
            to=[settings.COMPANY_EMAIL]
        )
        
        if html_content:
            msg.attach_alternative(html_content, "text/html")
        
        msg.send(fail_silently=False)
        
        return f"Admin notification sent for order {order.order_number}"
        
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_custom_order_customer_email(self, order_number, name, email, project_type_display):
    """
    Send HTML confirmation email to customer about their custom order
    
    Args:
        order_number: Order number
        name: Customer name
        email: Customer email
        project_type_display: Human-readable project type
    """
    try:
        # Context for template
        context = {
            'customer_name': name,
            'order_number': order_number,
            'project_type': project_type_display,
            'company_email': settings.COMPANY_EMAIL,
            'company_phone': settings.COMPANY_PHONE,
        }
        
        # Render HTML template
        html_content = render_to_string('emails/customer_confirmation.html', context)
        
        # Plain text fallback
        text_content = f'''
Dear {name},

Thank you for your custom order request at Basho By Shivangi!

Order Number: {order_number}
Project Type: {project_type_display}

We have received your request and will contact you within 24 hours to discuss your project in detail.

If you have any immediate questions, please contact us at:
Email: {settings.COMPANY_EMAIL}
Phone: {settings.COMPANY_PHONE}

With heartfelt appreciation,
BASHO BY SHIVANGI
        '''
        
        # Create email
        subject = f'Thank You for Your Order - {order_number}'
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.COMPANY_EMAIL,
            to=[email]
        )
        msg.attach_alternative(html_content, "text/html")

        # Attach image with Content-ID
        import os
        from email.mime.image import MIMEImage
        
        image_path = os.path.join(settings.BASE_DIR, 'email_header.jpg')
        if os.path.exists(image_path):
            with open(image_path, 'rb') as f:
                img = MIMEImage(f.read())
                img.add_header('Content-ID', '<header_image>')
                img.add_header('Content-Disposition', 'inline', filename='header.jpg')
                msg.attach(img)
        
        msg.send(fail_silently=False)
        
        return f"Customer email sent successfully to {email} for order {order_number}"
        
    except Exception as exc:
        # Retry the task if it fails
        raise self.retry(exc=exc)


# ====================
# PRODUCT ORDER EMAIL TASKS
# ====================

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_product_order_confirmation_email(self, order_id):
    """
    Send order confirmation email to customer after successful payment
    
    Args:
        order_id: Order database ID
    """
    try:
        from .models import Order
        
        # Get order from database
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return f"Order {order_id} not found"
        
        # Prepare context data for email template
        context = {
            'customer_name': order.customer_name,
            'order_number': order.order_number,
            'order_date': order.created_at.strftime('%B %d, %Y at %I:%M %p'),
            'payment_method': order.get_payment_method_display(),
            'subtotal': f"{order.subtotal:,.2f}",
            'shipping_charge': f"{order.shipping_charge:,.2f}",
            'tax_amount': f"{order.tax_amount:,.2f}",
            'discount_amount': f"{order.discount_amount:,.2f}",
            'total_amount': f"{order.total_amount:,.2f}",
            'shipping_address': order.shipping_address,
            'shipping_city': order.shipping_city,
            'shipping_state': order.shipping_state,
            'shipping_pincode': order.shipping_pincode,
            'customer_phone': order.customer_phone,
            'company_email': settings.COMPANY_EMAIL,
            'company_phone': settings.COMPANY_PHONE,
            'order_items': [],
        }
        
        # Add order items to context
        for item in order.items.all():
            context['order_items'].append({
                'product_name': item.product_name,
                'quantity': item.quantity,
                'product_price': f"{item.product_price:,.2f}",
                'total_price': f"{item.get_total_price():,.2f}",
            })
        
        # Render HTML email template
        html_content = render_to_string('emails/order_confirmation.html', context)
        
        # Create plain text version (fallback)
        text_content = f"""
Dear {order.customer_name},

Thank you for your order!

Order Number: {order.order_number}
Order Date: {context['order_date']}
Payment Status: Paid
Total Amount: ₹{context['total_amount']}

We'll process your order and send you tracking details soon.

Thank you for supporting Basho By Shivangi!

Best regards,
Basho By Shivangi Team
        """.strip()
        
        # Create email message
        subject = f"Order Confirmation #{order.order_number} - Basho By Shivangi"
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[order.customer_email]
        )
        
        # Attach HTML version
        msg.attach_alternative(html_content, "text/html")
        
        # Attach header image inline
        import os
        from email.mime.image import MIMEImage
        
        header_image_path = os.path.join(settings.BASE_DIR, 'email_header.jpg')
        if os.path.exists(header_image_path):
            with open(header_image_path, 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', '<header_image>')
                img.add_header('Content-Disposition', 'inline', filename='header.jpg')
                msg.attach(img)
        
        # Send email
        msg.send(fail_silently=False)
        
        return f"Order confirmation email sent to {order.customer_email} for order {order.order_number}"
        
    except Exception as exc:
        # Retry the task if it fails
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_product_order_admin_notification(self, order_id):
    """
    Send notification email to admin when new product order is placed
    
    Args:
        order_id: Order database ID
    """
    try:
        from .models import Order
        
        # Get order from database
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return f"Order {order_id} not found"
        
        # Prepare email content
        subject = f"New Order Received - {order.order_number}"
        
        text_content = f"""
New order received!

Order Number: {order.order_number}
Customer: {order.customer_name}
Email: {order.customer_email}
Phone: {order.customer_phone}
Total Amount: ₹{order.total_amount:,.2f}
Payment Status: {'Paid' if order.payment_status else 'Pending'}

Items:
"""
        
        for item in order.items.all():
            text_content += f"- {item.product_name} x {item.quantity} = ₹{item.get_total_price():,.2f}\n"
        
        text_content += f"""
Shipping Address:
{order.shipping_address}
{order.shipping_city}, {order.shipping_state} {order.shipping_pincode}

View in admin: http://127.0.0.1:8000/admin/products/order/{order.id}/

Please process this order in the admin panel.
        """.strip()
        
        # Create and send email
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.COMPANY_EMAIL]
        )
        
        msg.send(fail_silently=False)
        
        return f"Admin notification sent for order {order.order_number}"
        
    except Exception as exc:
        # Retry the task if it fails
        raise self.retry(exc=exc)


# ====================
# WORKSHOP REGISTRATION EMAIL TASKS
# ====================

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_workshop_confirmation_email(self, registration_id):
    """
    Send workshop registration confirmation email to customer
    
    Args:
        registration_id: WorkshopRegistration database ID
    """
    try:
        from workshops.models import WorkshopRegistration
        
        # Get registration from database
        try:
            registration = WorkshopRegistration.objects.get(id=registration_id)
        except WorkshopRegistration.DoesNotExist:
            return f"Workshop registration {registration_id} not found"
        
        # Prepare context data for email template
        context = {
            'customer_name': registration.full_name,
            'registration_number': registration.registration_number,
            'workshop_name': registration.workshop.name,
            'workshop_type': registration.workshop.get_workshop_type_display(),
            'difficulty_level': registration.workshop.get_difficulty_level_display(),
            'duration': registration.workshop.duration_hours,
            'number_of_participants': registration.number_of_participants,
            'total_amount': f"{registration.total_amount:,.2f}",
            'status': registration.get_status_display(),
            'special_requests': registration.special_requests,
            'company_email': settings.COMPANY_EMAIL,
            'company_phone': settings.COMPANY_PHONE,
        }
        
        # Add slot information if available
        if registration.slot:
            context['slot_date'] = registration.slot.date.strftime('%B %d, %Y')
            context['slot_time'] = f"{registration.slot.start_time.strftime('%I:%M %p')} - {registration.slot.end_time.strftime('%I:%M %p')}"
        
        # Render HTML email template
        html_content = render_to_string('emails/workshop_confirmation.html', context)
        
        # Create plain text version (fallback)
        text_content = f"""
Dear {registration.full_name},

Thank you for registering for our pottery workshop!

Registration Number: {registration.registration_number}
Workshop: {registration.workshop.name}
Participants: {registration.number_of_participants}
Total Amount: ₹{registration.total_amount:,.2f}

We're excited to have you join us for a creative and enriching experience.

If you have any questions, please contact us:
Email: {settings.COMPANY_EMAIL}
Phone: {settings.COMPANY_PHONE}

See you soon!
Team Basho By Shivangi
        """.strip()
        
        # Create email message
        subject = f"Workshop Registration Confirmed - {registration.registration_number}"
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[registration.email]
        )
        
        # Attach HTML version
        msg.attach_alternative(html_content, "text/html")
        
        # Attach header image inline
        import os
        from email.mime.image import MIMEImage
        
        header_image_path = os.path.join(settings.BASE_DIR, 'email_header.jpg')
        if os.path.exists(header_image_path):
            with open(header_image_path, 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', '<header_image>')
                img.add_header('Content-Disposition', 'inline', filename='header.jpg')
                msg.attach(img)
        
        # Send email
        msg.send(fail_silently=False)
        
        return f"Workshop confirmation email sent to {registration.email} for {registration.registration_number}"
        
    except Exception as exc:
        # Retry the task if it fails
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_workshop_admin_notification(self, registration_id):
    """
    Send notification email to admin when new workshop registration is created
    
    Args:
        registration_id: WorkshopRegistration database ID
    """
    try:
        from workshops.models import WorkshopRegistration
        
        # Get registration from database
        try:
            registration = WorkshopRegistration.objects.get(id=registration_id)
        except WorkshopRegistration.DoesNotExist:
            return f"Workshop registration {registration_id} not found"
        
        # Prepare email content
        subject = f"New Workshop Registration - {registration.registration_number}"
        
        text_content = f"""
New workshop registration received!

Registration Number: {registration.registration_number}
Workshop: {registration.workshop.name}
Customer: {registration.full_name}
Email: {registration.email}
Phone: {registration.phone}
Participants: {registration.number_of_participants}
Total Amount: ₹{registration.total_amount:,.2f}
Status: {registration.get_status_display()}
"""
        
        if registration.slot:
            text_content += f"""
Scheduled Slot:
Date: {registration.slot.date.strftime('%B %d, %Y')}
Time: {registration.slot.start_time.strftime('%I:%M %p')} - {registration.slot.end_time.strftime('%I:%M %p')}
"""
        
        if registration.special_requests:
            text_content += f"""
Special Requests:
{registration.special_requests}
"""
        
        text_content += f"""
View in admin: http://127.0.0.1:8000/admin/workshops/workshopregistration/{registration.id}/

Please confirm the registration and prepare for the workshop.
        """.strip()
        
        # Create and send email
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.COMPANY_EMAIL]
        )
        
        msg.send(fail_silently=False)
        
        return f"Admin notification sent for workshop registration {registration.registration_number}"
        
    except Exception as exc:
        # Retry the task if it fails
        raise self.retry(exc=exc)


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


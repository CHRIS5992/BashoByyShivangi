"""
Email utility functions for sending order-related emails
"""

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from email.mime.image import MIMEImage
import os
import logging

logger = logging.getLogger(__name__)


def send_order_confirmation_email(order):
    """
    Send order confirmation email to customer after successful payment
    
    Args:
        order: Order model instance
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
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
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = order.customer_email
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=from_email,
            to=[to_email]
        )
        
        # Attach HTML version
        msg.attach_alternative(html_content, "text/html")
        
        # Attach header image inline
        header_image_path = os.path.join(settings.BASE_DIR, 'email_header.jpg')
        if os.path.exists(header_image_path):
            with open(header_image_path, 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', '<header_image>')
                img.add_header('Content-Disposition', 'inline', filename='header.jpg')
                msg.attach(img)
        
        # Send email
        msg.send()
        
        logger.info(f"Order confirmation email sent successfully to {to_email} for order {order.order_number}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send order confirmation email for order {order.order_number}: {str(e)}")
        return False


def send_admin_order_notification(order):
    """
    Send notification email to admin when new order is placed
    
    Args:
        order: Order model instance
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
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

Please process this order in the admin panel.
        """.strip()
        
        # Create and send email
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.COMPANY_EMAIL]
        )
        
        msg.send()
        
        logger.info(f"Admin notification email sent for order {order.order_number}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send admin notification for order {order.order_number}: {str(e)}")
        return False

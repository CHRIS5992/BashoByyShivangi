from django.db import models


class Creation(models.Model):
    """
    Model for gallery items displayed in the Masonry "Our Creations" section.
    Managed via Django Admin for easy content updates.
    """
    image = models.ImageField(
        upload_to='creations/',
        help_text='Upload a high-quality image for the gallery'
    )
    url = models.URLField(
        blank=True,
        null=True,
        help_text='Link to product page or event (optional)'
    )
    height = models.IntegerField(
        default=300,
        help_text='Height in pixels for masonry layout (e.g., 200, 300, 400)'
    )
    order = models.IntegerField(
        default=0,
        help_text='Display order (lower numbers appear first)'
    )
    alt_text = models.CharField(
        max_length=255,
        blank=True,
        default='Basho Creation',
        help_text='Alt text for accessibility'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='Uncheck to hide from gallery'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Creation'
        verbose_name_plural = 'Creations Gallery'

    def __str__(self):
        return f"Creation #{self.id} - Order {self.order}"

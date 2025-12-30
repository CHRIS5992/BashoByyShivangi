"""
Basho Admin Site Customization
Custom branding and organization for Django admin
"""

from django.contrib import admin
from django.contrib.admin import AdminSite


class BashoAdminSite(AdminSite):
    """
    Custom admin site for Basho
    Provides better branding and user experience
    """
    
    # Site header (appears at the top of every admin page)
    site_header = '🏺 Basho By Shivangi - Admin Panel'
    
    # Site title (appears in browser title bar)
    site_title = 'Basho Admin'
    
    # Text at the top of the admin index page
    index_title = 'Manage Your E-commerce Store'
    
    # Enable app index page
    enable_nav_sidebar = True
    
    def each_context(self, request):
        """
        Add custom context to all admin pages
        """
        context = super().each_context(request)
        context.update({
            'site_header': self.site_header,
            'site_title': self.site_title,
            'index_title': self.index_title,
            'has_permission': request.user.is_active and request.user.is_staff,
        })
        return context


# Use the custom admin site
# Note: This is configured via Jazzmin settings in settings.py
# The customizations above enhance the default admin site

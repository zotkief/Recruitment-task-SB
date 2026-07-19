from django.urls import path

from api.views import ContactView, ContactStatusView, ContactImportView


urlpatterns = [
    path(
        "contacts/",
        ContactView.as_view(
            {
                "get": "get",
                "post": "post",
            }
        ),
        name="contacts",
    ),

    path(
        "contacts/<int:pk>/",
        ContactView.as_view(
            {
                "put": "put",
                "delete": "delete",
            }
        ),
        name="contact-detail",
    ),
    
    path(
        "contacts/import/",
        ContactImportView.as_view(),
        name="contact-import",
    ),
    
    path(
        "statuses/",
        ContactStatusView.as_view(),
        name="contact-status-list",
    ),
]
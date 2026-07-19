from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from drf_spectacular.utils import extend_schema

from api.serializers import (
    ContactImportSerializer,
    MessageSerializer,
    ErrorSerializer,
)

from api.services.contact_import_service import (
    ContactImportService,
)


class ContactImportView(APIView):

    @extend_schema(
        summary="Import contacts from CSV",
        description=(
            "Uploads CSV file and creates contacts. "
            "Invalid rows are returned in errors."
        ),
        request=ContactImportSerializer,
        responses={
            200: MessageSerializer,
            400: ErrorSerializer,
        },
    )
    def post(self, request):

        serializer = ContactImportSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        result = ContactImportService.import_contacts(
            serializer.validated_data["file"]
        )

        return Response(
            {
                "message": "Import finished.",
                "created": result["created"],
                "errors": result["errors"],
            },
            status=status.HTTP_200_OK,
        )
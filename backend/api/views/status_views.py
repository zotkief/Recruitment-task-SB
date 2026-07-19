from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from drf_spectacular.utils import extend_schema

from api.models import ContactStatus

from api.serializers.main_serializers import (
    ContactStatusSerializer,
)


from api.serializers.message_serializers import (
    ErrorSerializer,
)


class ContactStatusView(APIView):
    """
    View responsible for returning available contact statuses.
    """


    @extend_schema(
        summary="Get contact statuses",
        description=(
            "Returns all available contact statuses "
            "that can be assigned to contacts."
        ),
        responses={
            200: ContactStatusSerializer(many=True),
            400: ErrorSerializer,
        },
    )
    def get(self, request):
        """
        Returns contact statuses.
        """

        queryset = ContactStatus.objects.all()

        serializer = ContactStatusSerializer(
            queryset,
            many=True,
        )
    

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
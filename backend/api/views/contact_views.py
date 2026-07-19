from django.db.models import Q

from rest_framework import status, viewsets
from rest_framework.response import Response

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
)

from api.models import Contact

from api.serializers import (
    ContactSerializer,
    ContactSearchSerializer,
    MessageSerializer,
    ErrorSerializer,
    ContactWithWeatherSerializer
)

from api.services import WeatherService

class ContactView(viewsets.ViewSet):
    """
    View responsible for contact management.
    """


    @extend_schema(
        summary="Get contacts",
        description=(
            "Returns contacts list. "
            "Supports searching and sorting."
        ),
        parameters=[
            OpenApiParameter(
                name="search",
                description=(
                    "Search by first name, last name, "
                    "email or phone number."
                ),
                required=False,
                type=str,
            ),
            OpenApiParameter(
                name="city",
                description="Filter by city.",
                required=False,
                type=str,
            ),
            OpenApiParameter(
                name="status",
                description="Filter by status ID.",
                required=False,
                type=int,
            ),
            OpenApiParameter(
                name="ordering",
                description=(
                    "Sort by: last_name, -last_name, "
                    "created_at, -created_at."
                ),
                required=False,
                type=str,
            ),
        ],
        responses={
            200: ContactWithWeatherSerializer(many=True),
            400: ErrorSerializer,
        },
    )
    def get(self, request):
        """
        Returns contacts with weather information.
        """

        input_serializer = ContactSearchSerializer(
            data=request.query_params
        )

        input_serializer.is_valid(
            raise_exception=True
        )

        filters = input_serializer.validated_data


        queryset = Contact.objects.select_related(
            "status"
        ).all()


        if search := filters.get("search"):
            queryset = queryset.filter(
                Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
                | Q(email__icontains=search)
                | Q(phone_number__icontains=search)
            )


        if city := filters.get("city"):
            queryset = queryset.filter(
                city__icontains=city
            )


        if status_id := filters.get("status"):
            queryset = queryset.filter(
                status_id=status_id
            )


        if ordering := filters.get("ordering"):
            queryset = queryset.order_by(ordering)


        contact_serializer = ContactSerializer(
            queryset,
            many=True,
        )

        contacts = contact_serializer.data


        # Fetch weather only once for every unique city.
        cities = {
            contact["city"]
            for contact in contacts
        }

        cities_data = {}

        for city_name in cities:
            cities_data[city_name] = (
                WeatherService.get_weather(city_name)
            )


        response_data = []

        # Here weather is added to final results, according to data fetched from weather API.
        for contact in contacts:
            response_data.append(
                {
                    "contact": contact,
                    "weather": cities_data.get(
                        contact["city"]
                    ),
                }
            )


        output_serializer = ContactWithWeatherSerializer(
            response_data,
            many=True,
        )


        return Response(
            output_serializer.data,
            status=status.HTTP_200_OK,
        )



    @extend_schema(
        summary="Create contact",
        description="Creates new contact.",
        request=ContactSerializer,
        responses={
            201: ContactSerializer,
            400: ErrorSerializer,
        },
    )
    def post(self, request):
        """
        Creates contact.
        """

        serializer = ContactSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )



    @extend_schema(
        summary="Update contact",
        description="Updates existing contact.",
        request=ContactSerializer,
        responses={
            200: ContactSerializer,
            400: ErrorSerializer,
            404: ErrorSerializer,
        },
    )
    def put(self, request, pk=None):
        """
        Updates contact.
        """

        try:
            contact = Contact.objects.get(
                id=pk
            )

        except Contact.DoesNotExist:
            return Response(
                {
                    "error": "Contact not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        serializer = ContactSerializer(
            contact,
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()


        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )



    @extend_schema(
        summary="Delete contact",
        description="Deletes contact.",
        responses={
            200: MessageSerializer,
            404: ErrorSerializer,
        },
    )
    def delete(self, request, pk=None):
        """
        Deletes contact.
        """

        try:
            contact = Contact.objects.get(
                id=pk
            )

        except Contact.DoesNotExist:
            return Response(
                {
                    "error": "Contact not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        contact.delete()


        return Response(
            {
                "message": "Contact deleted successfully."
            },
            status=status.HTTP_200_OK,
        )
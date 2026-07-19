from rest_framework import serializers

from api.models import Contact, ContactStatus


class ContactStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactStatus
        fields = (
            "id",
            "name",
        )


class ContactSerializer(serializers.ModelSerializer):
    status = ContactStatusSerializer(read_only=True)

    status_id = serializers.PrimaryKeyRelatedField(
        source="status",
        queryset=ContactStatus.objects.all(),
        write_only=True,
    )

    class Meta:
        model = Contact

        fields = (
            "id",
            "first_name",
            "last_name",
            "phone_number",
            "email",
            "city",
            "status",
            "status_id",
            "created_at",
        )

        read_only_fields = (
            "id",
            "created_at",
        )
   
    def validate_first_name(self, value):
        return value.strip().title()


    def validate_last_name(self, value):
        return value.strip().title()


    def validate_city(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "City cannot be empty."
            )

        return value.title()
    
    

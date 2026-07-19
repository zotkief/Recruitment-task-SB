from rest_framework import serializers


class ContactImportSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        if not value.name.endswith(".csv"):
            raise serializers.ValidationError(
                "Only CSV files are allowed."
            )

        return value


class ContactSearchSerializer(serializers.Serializer):
    search = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    city = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    status = serializers.IntegerField(
        required=False,
    )

    ordering = serializers.ChoiceField(
        required=False,
        choices=[
            "last_name",
            "-last_name",
            "created_at",
            "-created_at",
        ],
    )
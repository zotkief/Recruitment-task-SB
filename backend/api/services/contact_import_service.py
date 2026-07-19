import csv
import io

from django.db import transaction

from api.models import Contact
from api.serializers import ContactSerializer


class ContactImportService:

    @staticmethod
    @transaction.atomic
    def import_contacts(file):

        decoded_file = file.read().decode("utf-8")

        csv_reader = csv.DictReader(
            io.StringIO(decoded_file)
        )

        created_contacts = []
        errors = []

        for row_number, row in enumerate(
            csv_reader,
            start=2,
        ):

            serializer = ContactSerializer(
                data=row
            )

            if serializer.is_valid():

                contact = serializer.save()

                created_contacts.append(
                    contact
                )

            else:
                errors.append(
                    {
                        "row": row_number,
                        "errors": serializer.errors,
                    }
                )

        return {
            "created": len(created_contacts),
            "errors": errors,
        }
from django.core.management.base import BaseCommand

from api.models import ContactStatus


class Command(BaseCommand):
    help = "Creates default contact statuses"

    def handle(self, *args, **kwargs):
        statuses = [
            "New",
            "In Progress",
            "Lost",
            "Outdated",
        ]

        for status in statuses:
            ContactStatus.objects.get_or_create(
                name=status
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Statuses created"
            )
        )
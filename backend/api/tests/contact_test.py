from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from api.models import Contact, ContactStatus


class ContactApiTests(APITestCase):
    """
    Tests for contact API endpoints.
    """


    def setUp(self):
        """
        Creates required database objects.
        """

        self.status_new = ContactStatus.objects.create(
            name="New"
        )

        self.status_progress = ContactStatus.objects.create(
            name="In Progress"
        )

        self.contact = Contact.objects.create(
            first_name="John",
            last_name="Smith",
            phone_number="+48123123123",
            email="john@test.com",
            city="Warsaw",
            status=self.status_new,
        )


    def test_get_contacts(self):
        """
        User can retrieve contacts list.
        """

        url = reverse(
            "contacts"
        )

        response = self.client.get(
            url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data),
            1,
        )

        self.assertEqual(
            response.data[0]["first_name"],
            "John",
        )


    def test_create_contact(self):
        """
        User can create new contact.
        """

        url = reverse(
            "contacts"
        )

        data = {
            "first_name": "Anna",
            "last_name": "Kowalska",
            "phone_number": "+48987654321",
            "email": "anna@test.com",
            "city": "Krakow",
            "status_id": self.status_progress.id,
        }


        response = self.client.post(
            url,
            data,
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )


        self.assertEqual(
            Contact.objects.count(),
            2,
        )


        self.assertEqual(
            response.data["email"],
            "anna@test.com",
        )



    def test_create_contact_with_duplicate_email(self):
        """
        User cannot create contact with duplicated email.
        """

        url = reverse(
            "contacts"
        )


        data = {
            "first_name": "Another",
            "last_name": "Person",
            "phone_number": "+48111111111",
            "email": "john@test.com",
            "city": "Gdansk",
            "status_id": self.status_new.id,
        }


        response = self.client.post(
            url,
            data,
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )


        self.assertIn(
            "email",
            response.data,
        )



    def test_update_contact(self):
        """
        User can update existing contact.
        """

        url = reverse(
            "contact-detail",
            kwargs={
                "pk": self.contact.id
            },
        )


        data = {
            "first_name": "Updated",
            "last_name": "Smith",
            "phone_number": "+48123123123",
            "email": "john@test.com",
            "city": "Wroclaw",
            "status_id": self.status_progress.id,
        }


        response = self.client.put(
            url,
            data,
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )


        self.contact.refresh_from_db()


        self.assertEqual(
            self.contact.city,
            "Wroclaw",
        )



    def test_delete_contact(self):
        """
        User can delete contact.
        """

        url = reverse(
            "contact-detail",
            kwargs={
                "pk": self.contact.id
            },
        )


        response = self.client.delete(
            url
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )


        self.assertFalse(
            Contact.objects.filter(
                id=self.contact.id
            ).exists()
        )



    def test_filter_contacts_by_city(self):
        """
        User can filter contacts by city.
        """

        url = reverse(
            "contacts"
        )


        response = self.client.get(
            url,
            {
                "city": "Warsaw"
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(
            len(response.data),
            1,
        )
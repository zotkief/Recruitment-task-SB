from rest_framework import serializers

from api.serializers import ContactSerializer


class WeatherSerializer(serializers.Serializer):
    temperature = serializers.FloatField()
    humidity = serializers.IntegerField()
    wind_speed = serializers.FloatField()

class ContactWithWeatherSerializer(serializers.Serializer):
    """
    Serializer returned by the contacts endpoint.
    """

    contact = ContactSerializer()
    weather = WeatherSerializer()

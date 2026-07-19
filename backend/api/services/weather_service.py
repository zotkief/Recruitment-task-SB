from django.core.cache import cache

import requests


class WeatherService:

    CACHE_TIME = 60 * 30  # 30 minutes


    @staticmethod
    def get_weather(
        city_name: str,
    ) -> dict:

        cache_key = (
            f"weather:{city_name.lower()}"
        )

        cached_weather = cache.get(
            cache_key
        )

        if cached_weather:
            return cached_weather


        weather = WeatherService.fetch_weather(
            city_name
        )


        cache.set(
            cache_key,
            weather,
            WeatherService.CACHE_TIME,
        )

        return weather



    @staticmethod
    def fetch_weather(
        city_name: str,
    ) -> dict:

        try:

            response = requests.get(
                "https://nominatim.openstreetmap.org/search",
                params={
                    "q": city_name,
                    "format": "json",
                    "limit": 1,
                },
                headers={
                    "User-Agent": "RecruitmentTask/1.0",
                },
                timeout=5,
            )

            response.raise_for_status()

            locations = response.json()


            # City was not found.
            # If this happens all data will be set to 0.
            if not locations:
                return WeatherService.empty_weather()



            location = locations[0]


            response = requests.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": location["lat"],
                    "longitude": location["lon"],
                    "current": [
                        "temperature_2m",
                        "relative_humidity_2m",
                        "wind_speed_10m",
                    ],
                },
                timeout=5,
            )

            response.raise_for_status()


            current = response.json()["current"]


            return {
                "temperature": current[
                    "temperature_2m"
                ],
                "humidity": current[
                    "relative_humidity_2m"
                ],
                "wind_speed": current[
                    "wind_speed_10m"
                ],
            }


        except (
            requests.RequestException,
            KeyError,
            IndexError,
        ):
            return WeatherService.empty_weather()



    @staticmethod
    def empty_weather() -> dict:

        return {
            "temperature": 0,
            "humidity": 0,
            "wind_speed": 0,
        }
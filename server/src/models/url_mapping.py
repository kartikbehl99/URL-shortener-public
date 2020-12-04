import db
from typing import Union


class URLMapping:
    def __init__(self, long_url: Union[str, None], short_url: Union[str, None] = None):
        self._long_url = long_url
        self._short_url = short_url

    def store(self) -> bool:
        try:
            url_mapping = {
                'long_url': self._long_url,
                'short_url': self._short_url
            }
            db.url_mappings.insert_one(url_mapping)
        except Exception as e:
            print(str(e))
            return False

        return True

    def short_url(self) -> Union[str, None]:
        try:
            obj = db.url_mappings.find_one({"long_url": self._long_url})
            return obj[u'short_url']
        except Exception:
            return None

    def long_url(self) -> Union[str, None]:
        try:
            obj = db.url_mappings.find_one({"short_url": self._short_url})
            return obj[u'long_url']
        except Exception:
            return None

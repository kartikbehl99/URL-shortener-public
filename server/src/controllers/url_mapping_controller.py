from typing import List, Union
from models.url_mapping import URLMapping

base62Chars: List[str] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                          'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                          'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']


class URLMappingController:
    def __init__(self, long_url: Union[str, None], short_url: Union[str, None]):
        self._long_url = long_url
        self._short_url = short_url

    @staticmethod
    def unique_id() -> int:
        id: int = 0
        with open('./unique_id', 'r+') as unique_id:
            id = int(unique_id.read())
            unique_id.seek(0)
            unique_id.write(str(id + 1))
        return id

    @staticmethod
    def convert_to_base62(num: int) -> str:
        base62String: str = ''

        while num != 0:
            digit: int = num % 62
            num = num // 62
            base62String += base62Chars[digit]

        return base62String

    def short_url(self) -> str:
        unique_id: int = self.unique_id()
        url_hash: str = self.convert_to_base62(unique_id)
        return url_hash

    def long_url(self) -> Union[str, None]:
        url: Union[str, None] = URLMapping(long_url=self._long_url,
                                           short_url=self._short_url).long_url()
        return url

    def generate_and_store(self) -> Union[str, None]:
        self._short_url: Union[str, None] = URLMapping(
            long_url=self._long_url, short_url=None).short_url()

        if self._short_url:
            return self._short_url

        self._short_url: str = self.short_url()
        success: bool = URLMapping(
            long_url=self._long_url, short_url=self._short_url).store()

        if success:
            return self._short_url
        return None

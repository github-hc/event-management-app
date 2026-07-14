from app.models.event import Event
from app.models.registration import Registration


class MemoryDB:
    """Singleton in-memory data store for events and registrations."""

    def __init__(self):
        self.events: dict[int, Event] = {}
        self.registrations: list[Registration] = []
        self.event_counter: int = 1
        self.registration_counter: int = 1


db = MemoryDB()
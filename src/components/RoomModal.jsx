import { useEffect, useState } from 'react';
import { ROOMS } from '../data/content';
import Modal from './Modal';
import { Button, Picture } from './ui';

export default function RoomModal({ roomId, onClose, onBook }) {
  // Keep showing the last room while the close animation plays.
  const [shown, setShown] = useState(roomId);
  useEffect(() => { if (roomId) setShown(roomId); }, [roomId]);
  const room = ROOMS.find((r) => r.id === shown);
  if (!room) return null;
  const index = ROOMS.indexOf(room);

  return (
    <Modal open={!!roomId} onClose={onClose} labelledBy="room-title" className="modal--room">
      <div className="room-sheet">
        <div className="room-sheet__media" data-modal-media>
          <Picture name={room.image} alt={room.alt} sizes="(max-width: 900px) 100vw, 58vw" position={room.position} />
        </div>
        <div className="room-sheet__body">
          <p className="eyebrow" data-modal-item>
            Rooms &amp; Suites · {String(index + 1).padStart(2, '0')}
          </p>
          <h2 id="room-title" className="room-sheet__title" data-modal-item>{room.name}</h2>
          <p className="room-sheet__text" data-modal-item>{room.long}</p>
          <ul className="room-sheet__features" data-modal-item>
            {room.features.map((f) => <li key={f}>{f}</li>)}
          </ul>
          <div className="room-sheet__cta" data-modal-item>
            <Button variant="solid" size="lg" onClick={() => onBook(room.name)} data-autofocus>
              Book this room
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

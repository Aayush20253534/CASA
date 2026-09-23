import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { BookingContext } from './lib/booking';
import { initSmoothScroll, REDUCED, ScrollTrigger, setupReveals } from './lib/motion';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import { Amenities, Book, Experience, Intro, Location, Rooms } from './components/Sections';
import Moments from './components/Moments';
import Gallery from './components/Gallery';
import { FinalCTA, Footer } from './components/Closing';

const BookingModal = lazy(() => import('./components/BookingModal'));
const RoomModal = lazy(() => import('./components/RoomModal'));

export default function App() {
  const [ready, setReady] = useState(REDUCED);
  const [booking, setBooking] = useState({ open: false, room: '' });
  const [roomId, setRoomId] = useState(null);
  const [modalsRequested, setModalsRequested] = useState(false);

  useEffect(() => initSmoothScroll(), []);

  // Children create their pinned timelines first; generic reveals come after,
  // then everything is re-measured in document order.
  useLayoutEffect(() => {
    const cleanup = setupReveals();
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return cleanup;
  }, []);

  // Warm the modal chunk shortly after load so the first click is instant.
  useEffect(() => {
    const t = setTimeout(() => setModalsRequested(true), 3500);
    return () => clearTimeout(t);
  }, []);

  const openBooking = useCallback((room = '') => {
    setModalsRequested(true);
    setRoomId(null);
    setBooking({ open: true, room });
  }, []);

  const viewRoom = useCallback((id) => {
    setModalsRequested(true);
    setRoomId(id);
  }, []);

  const ctx = useMemo(() => ({ openBooking, viewRoom }), [openBooking, viewRoom]);
  const onPreloaded = useCallback(() => setReady(true), []);

  return (
    <BookingContext.Provider value={ctx}>
      {!ready && <Preloader onDone={onPreloaded} />}
      <Cursor />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <div className="story">
          <Intro />
          <Experience />
          <Rooms />
          <Moments />
          <Amenities />
          <Gallery />
          <Location />
          <Book />
          <FinalCTA />
        </div>
      </main>
      <Footer />
      {modalsRequested && (
        <Suspense fallback={null}>
          <RoomModal roomId={roomId} onClose={() => setRoomId(null)} onBook={openBooking} />
          <BookingModal
            open={booking.open}
            room={booking.room}
            onClose={() => setBooking((b) => ({ ...b, open: false }))}
          />
        </Suspense>
      )}
    </BookingContext.Provider>
  );
}

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

  // Smooth scrolling does no useful work while the preloader owns the page.
  // Starting it after the reveal removes a continuous animation-loop callback
  // from the critical startup path without changing the final interaction.
  useEffect(() => {
    if (!ready) return undefined;
    return initSmoothScroll();
  }, [ready]);

  // Children create their pinned timelines first. The generic page-wide
  // SplitText/reveal work is deliberately deferred until the preloader leaves,
  // then everything is measured once in document order.
  useLayoutEffect(() => {
    if (!ready) return undefined;
    let cancelled = false;
    const cleanup = setupReveals();
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [ready]);

  // Warm only the modal chunks during browser idle time. Previously the app
  // mounted both hidden modal trees after 3.5s, causing avoidable JS/DOM work.
  useEffect(() => {
    if (!ready) return undefined;
    let timer;
    let idleId;
    const warm = () => {
      void Promise.all([
        import('./components/BookingModal'),
        import('./components/RoomModal'),
      ]).catch(() => {});
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(warm, { timeout: 5000 });
    } else {
      timer = window.setTimeout(warm, 2500);
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [ready]);

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

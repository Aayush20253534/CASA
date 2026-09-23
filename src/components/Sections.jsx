import { AMENITIES, EXPERIENCE, HOTEL, NEARBY, ROOMS } from '../data/content';
import { useBooking } from '../lib/booking';
import { scrollToTarget } from '../lib/motion';
import Icon from './Icons';
import LocationMap from './LocationMap';
import { Arrow, Button, Picture, SectionLabel, TextLink } from './ui';

// 02 — Introduction
export function Intro() {
  return (
    <section className="intro section" id="about">
      <div className="container">
        <SectionLabel index="01">The House</SectionLabel>
        <div className="intro__head">
          <h2 className="display display--xl" data-split>
            A different kind <br />
            of <em>stay.</em>
          </h2>
          <div className="intro__copy">
            <p className="lede" data-fade>
              Behind a cream façade of tall arched windows, Casa De Grande keeps things
              quiet, warm and well looked after.
            </p>
            <p data-fade data-delay="0.1">
              Calm rooms, soft light, polished marble and a team that notices the small
              things. Set in the leafy lanes of George Town, it’s an easy base for exploring
              Prayagraj and a quiet place to come back to at the end of the day.
            </p>
            <TextLink href="#rooms" data-fade data-delay="0.2">Discover the rooms</TextLink>
          </div>
        </div>

        <div className="intro__media">
          <figure className="intro__main">
            <div className="frame frame--landscape" data-clip data-parallax="7">
              <Picture name="exterior" alt="Casa De Grande at dusk: three storeys of arched windows glowing above the entrance" sizes="(max-width: 900px) 100vw, 62vw" position="50% 40%" />
            </div>
            <figcaption data-fade>The façade at blue hour: arches, sconces and warm light</figcaption>
          </figure>
          <figure className="intro__aside" data-speed="0.6">
            <div className="frame frame--arch" data-clip data-parallax="8">
              <Picture name="corridor" alt="Crystal chandelier over a marble-floored corridor" sizes="(max-width: 900px) 60vw, 26vw" position="62% 50%" />
            </div>
            <figcaption data-fade>Crystal, walnut and marble underfoot</figcaption>
          </figure>
          <blockquote className="intro__quote" data-fade>
            <p>“Architecture that welcomes, hospitality that remembers.”</p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

// 03 — The Experience
export function Experience() {
  return (
    <section className="experience section" id="experience">
      <div className="container">
        <div className="section-head">
          <SectionLabel index="02">The Casa De Grande Experience</SectionLabel>
          <h2 className="display display--lg" data-split>
            Designed around <em>the details</em> that matter.
          </h2>
        </div>
      </div>
      <div className="experience__track" data-stagger>
        {EXPERIENCE.map((item, i) => (
          <a
            key={item.title}
            href={item.href}
            className="card"
            onClick={(e) => { e.preventDefault(); scrollToTarget(item.href); }}
            data-cursor="Explore"
          >
            <div className="card__media">
              <Picture name={item.image} alt={item.alt} sizes="(max-width: 700px) 80vw, (max-width: 1100px) 45vw, 24vw" position={item.position} />
            </div>
            <div className="card__body">
              <span className="card__index">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="card__title">{item.title}</h3>
              <p className="card__text">{item.text}</p>
              <Arrow className="card__arrow" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// 04 — Rooms & Suites
export function Rooms() {
  const { viewRoom } = useBooking();
  return (
    <section className="rooms section" id="rooms">
      <div className="container">
        <div className="rooms__head">
          <SectionLabel index="03">Rooms &amp; Suites</SectionLabel>
          <h2 className="display display--xxl" data-split>
            Your private <em>escape.</em>
          </h2>
          <p className="rooms__intro" data-fade>
            Three ways to stay, each with marble underfoot, warm light overhead and quiet
            that is easy to get used to.
          </p>
        </div>
        <div className="rooms__grid">
          {ROOMS.map((room, i) => (
            <article key={room.id} className={`room room--${i + 1}`} data-speed={[0.15, 0.45, 0.25][i]}>
              <button
                type="button"
                className="room__media"
                onClick={() => viewRoom(room.id)}
                aria-label={`View ${room.name}`}
                data-cursor="View"
              >
                <div className="frame frame--portrait" data-clip data-parallax="9">
                  <Picture name={room.image} alt={room.alt} sizes="(max-width: 900px) 90vw, 31vw" position={room.position} />
                </div>
              </button>
              <div className="room__body" data-fade>
                <p className="room__index">{String(i + 1).padStart(2, '0')} / {String(ROOMS.length).padStart(2, '0')}</p>
                <h3 className="room__name">{room.name}</h3>
                <p className="room__text">{room.short}</p>
                <button type="button" className="room__link" onClick={() => viewRoom(room.id)}>
                  View room <Arrow />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// 06 — Amenities
export function Amenities() {
  return (
    <section className="amenities section" id="amenities">
      <div className="container">
        <div className="amenities__head">
          <SectionLabel index="05">Amenities</SectionLabel>
          <h2 className="display display--lg" data-split>
            Considered <em>comforts.</em>
          </h2>
          <p data-fade>
            The essentials, done properly, with a few quiet indulgences that make a stay
            feel effortless.
          </p>
        </div>
        <ul className="amenities__grid" data-stagger>
          {AMENITIES.map((a) => (
            <li key={a.title} className="amenity">
              <Icon name={a.icon} className="amenity__icon" />
              <h3 className="amenity__title">{a.title}</h3>
              <p className="amenity__text">{a.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// 08 — Location
export function Location() {
  return (
    <section className="location section" id="location">
      <div className="container location__grid">
        <div className="location__copy">
          <SectionLabel index="07">Location</SectionLabel>
          <h2 className="display display--lg" data-split>
            Everything <br />within <em>reach.</em>
          </h2>
          <p className="lede" data-fade>
            On a quiet, tree-lined road in George Town, one of Prayagraj’s most established
            neighbourhoods, a short drive from the city’s landmarks, the railway junction
            and the confluence at Triveni Sangam.
          </p>
          <address className="location__address" data-fade>
            {HOTEL.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <ul className="location__nearby" data-stagger>
            {NEARBY.map((n) => (
              <li key={n.name}>
                <span>{n.name}</span>
                <span className="location__dots" />
                <span className="location__km">{n.distance}</span>
              </li>
            ))}
          </ul>
          <div className="location__ctas" data-fade>
            <Button href={HOTEL.directionsUrl} variant="solid">Get directions</Button>
            <TextLink href={HOTEL.mapsUrl}>View on Google Maps</TextLink>
          </div>
        </div>
        <div className="location__map" data-clip>
          <LocationMap />
        </div>
      </div>
    </section>
  );
}

// 09 — Book Your Stay
export function Book() {
  const { openBooking } = useBooking();
  return (
    <section className="book section" id="book">
      <div className="container book__grid">
        <div className="book__copy">
          <SectionLabel index="08">Reservations</SectionLabel>
          <h2 className="display display--xxl" data-split>
            Your stay <br />starts <em>here.</em>
          </h2>
          <p className="lede" data-fade>Reserve your stay at Casa De Grande Boutique Hotel.</p>
          <div className="book__cta" data-fade>
            <Button variant="solid" size="xl" onClick={() => openBooking()}>Book Now</Button>
          </div>
          <p className="book__alt" data-fade>
            Prefer to talk? Call <a href={HOTEL.phone.href}>{HOTEL.phone.display}</a> or message us on
            WhatsApp at{' '}
            <a href={`https://wa.me/${HOTEL.whatsapp.number}`} target="_blank" rel="noopener noreferrer">
              {HOTEL.whatsapp.display}
            </a>.
          </p>
        </div>
        <div className="book__media" data-speed="0.35">
          <div className="frame frame--arch frame--tall" data-clip data-parallax="8">
            <Picture name="room-grand" alt="Suite prepared for arrival with folded towels on the bench" sizes="(max-width: 900px) 80vw, 36vw" position="60% 50%" />
          </div>
        </div>
      </div>
    </section>
  );
}

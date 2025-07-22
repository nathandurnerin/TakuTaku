import PopulaireCarousel from "./PopulaireCarousel";
import SeinenCarousel from "./SeinenCarousel";
import ShojoCarousel from "./ShojoCarousel";
import ShonenCarousel from "./ShonenCarousel";

function CarouselGenre() {
  return (
    <>
      <section className="mx-10 xl:mx-50 lg:mx-20">
        <PopulaireCarousel />
        <ShonenCarousel />
        <SeinenCarousel />
        <ShojoCarousel />
      </section>
    </>
  );
}

export default CarouselGenre;

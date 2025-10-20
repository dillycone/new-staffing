import Carousel3D from "@/components/carousel-3d";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto pt-16 md:pt-24 pb-8">
        <Carousel3D />
      </div>
    </main>
  );
}

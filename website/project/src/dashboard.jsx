function DigitalAvengersDashboard() {
  const [section, setSection] = React.useState("overview");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950">
      <Sidebar active={section} onNavigate={setSection} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar section={section} onNavigate={setSection} />

        {/* Scrollable main area — pb-56 leaves room for the sticky terminal */}
        <main className="flex-1 overflow-y-auto px-6 pb-56 pt-5" id="main-scroll">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
            <section id="overview" data-screen-label="Overview"><Hero /></section>
            <section id="metrics"  data-screen-label="Metrics"><MetricsRow /></section>
            <section id="projects" data-screen-label="Projects"><ProjectsGrid /></section>
            <section id="roadmap"  data-screen-label="Roadmap"><RoadmapTimeline /></section>
            <section id="cases"    data-screen-label="Case Studies"><CaseStudyHub /></section>
            <section id="team"     data-screen-label="Team Links"><LinksRow /></section>
          </div>
        </main>

        <Terminal />
      </div>
    </div>
  );
}

window.DigitalAvengersDashboard = DigitalAvengersDashboard;

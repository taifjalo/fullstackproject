

export function About() {
    return (
        <>
        <div className="about-page">
      <div className="about-container">
        <h1>About Us</h1>
        <p className="intro">
          Welcome to HabitTrack – your daily companion to help build better habits, one day at a time.
        </p>

        <section className="box mission">
          <h2>Our Mission</h2>
          <p>
            Our mission is simple: to empower individuals to take control of their routines, boost productivity,
            and build habits that lead to long-term personal growth.
          </p>
        </section>

        <section className="box team">
          <h2>Meet the Team</h2>
          <p>
            We're a small group of developers, designers, and behavior enthusiasts passionate about self-improvement
            and habit science. We created HabitTrack to be simple, effective, and motivating.
          </p>
        </section>

        <section className="box values">
          <h2>What We Believe</h2>
          <ul>
            <li>🌱 Small changes lead to big results</li>
            <li>🔒 Your data is yours – always private and secure</li>
            <li>💡 Simplicity over complexity</li>
            <li>🎯 Focused on user-driven goals and growth</li>
          </ul>
        </section>

        <footer className="about-footer">
          <p>Thanks for being part of our journey! 🚀</p>
          <p>— The HabitTrack Team</p>
        </footer>
      </div>
    </div>
        </>
    )
}
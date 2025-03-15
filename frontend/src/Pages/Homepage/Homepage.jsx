import React from 'react';

const Homepage = () => {
  return (
    <div className="homepage-container">
      {/* Navigation Bar */}
      <header className="navbar">
        <nav>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Website</h1>
          <p>Your gateway to amazing experiences.</p>
          <a href="#features" className="cta-button">Learn More</a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="feature">
          <h2>Feature One</h2>
          <p>Discover how our first feature can make your life easier.</p>
        </div>
        <div className="feature">
          <h2>Feature Two</h2>
          <p>Learn more about our second powerful feature.</p>
        </div>
        <div className="feature">
          <h2>Feature Three</h2>
          <p>Experience the full potential of our third feature.</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2>About Us</h2>
        <p>We are dedicated to bringing you the best user experience through our innovative products.</p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <p>If you have any questions or feedback, feel free to reach out!</p>
        <a href="mailto:contact@example.com" className="cta-button">Email Us</a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;

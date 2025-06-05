import './About.css';

function About() {
  return (
    <div className="about">
      <h1>À propos</h1>
      <p>
        Nous sommes trois étudiants de CentraleSupélec : Alexandre, Tancrède et Théodore. 
        Notre projet, Matchd, est une plateforme de review de films qui permet de trouver 
        son coup de cœur cinématographique.
      </p>
      <img src="/team.png" alt="Team" className="team-image" />
    </div>
  );
}

export default About;

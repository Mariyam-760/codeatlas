import React from 'react';
import { Repo } from '@/types'; // Assuming Repo is defined in types

interface SolarSystemProps {
  language: string;
  repos: Repo[];
  onPlanetClick: (repo: Repo) => void;
  selectedRepo: Repo | null;
}

export const SolarSystem: React.FC<SolarSystemProps> = ({
  language,
  repos,
  onPlanetClick,
  selectedRepo,
}) => {
  // Your component logic here, e.g., render planets for each repo
  return (
    <group>
      {/* Example: Render a mesh or planet for each repo */}
      {repos.map((repo) => (
        <mesh
          key={repo.id}
          onClick={() => onPlanetClick(repo)}
          position={[Math.random() * 10, Math.random() * 10, Math.random() * 10]} // Random position for demo
        >
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial
            color={selectedRepo?.id === repo.id ? 'red' : 'blue'} // Highlight selected
          />
        </mesh>
      ))}
    </group>
  );
};
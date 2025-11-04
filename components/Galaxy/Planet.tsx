// components/Galaxy/Planet.tsx - Individual repository planet

'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Repo } from '@/types';
import { LANGUAGE_COLORS, GALAXY_CONFIG } from '@/lib/constants';
import { Star } from 'lucide-react';

interface PlanetProps {
  repo: Repo;
  position: [number, number, number];
  onClick: () => void;
  selected: boolean;
}

export function Planet({ repo, position, onClick, selected }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Calculate planet properties
  const size = Math.max(
    GALAXY_CONFIG.MIN_PLANET_SIZE,
    Math.min(
      GALAXY_CONFIG.MAX_PLANET_SIZE,
      repo.stars * GALAXY_CONFIG.STAR_SIZE_MULTIPLIER + 0.2
    )
  );

  const color = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Other;

  // Calculate brightness based on recency
  const daysSinceUpdate =
    (Date.now() - repo.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
  const brightness = Math.max(
    GALAXY_CONFIG.MIN_BRIGHTNESS,
    1 - daysSinceUpdate / GALAXY_CONFIG.BRIGHTNESS_DECAY_DAYS
  );

  // Animation
  useFrame(() => {
    if (meshRef.current) {
      // Rotate planet
      meshRef.current.rotation.y += GALAXY_CONFIG.ROTATION_SPEED;

      // Scale effect on hover/select
      const targetScale = hovered || selected ? 1.3 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={brightness * 0.5}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Tooltip */}
      {(hovered || selected) && (
        <Html distanceFactor={10}>
          <div className="bg-gray-900/95 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-gray-700 backdrop-blur-sm shadow-xl">
            <div className="font-bold mb-1">{repo.name}</div>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <span className="flex items-center gap-1">
                <Star size={12} className="text-yellow-400" />
                {repo.stars}
              </span>
              <span className="px-2 py-0.5 bg-gray-800 rounded">
                {repo.language}
              </span>
            </div>
          </div>
        </Html>
      )}

      {/* Point light for glow effect */}
      <pointLight
        color={color}
        intensity={brightness * 0.5}
        distance={size * 3}
      />

      {/* Orbit ring (optional) */}
      {selected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.2, size * 1.3, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
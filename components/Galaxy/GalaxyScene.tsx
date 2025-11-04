'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Stars, Sparkles, Html, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Repo } from '@/types';
import { LANGUAGE_COLORS } from '@/lib/constants';

interface GalaxySceneProps {
  repos: Repo[];
  onPlanetClick: (repo: Repo) => void;
  selectedRepo: Repo | null;
  filterLanguage?: string | null;
  updatedAfter?: Date | null;
  offset?: [number, number, number];
}

export function GalaxyScene({ repos, onPlanetClick, selectedRepo, filterLanguage, updatedAfter, offset }: GalaxySceneProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // Group repos by language
  const reposByLanguage = useMemo(() => {
    const grouped: Record<string, Repo[]> = {};
    repos.forEach((repo) => {
      const lang = repo.language || 'Other';
      if (!grouped[lang]) grouped[lang] = [];
      // Apply filters
      const passLang = !filterLanguage || filterLanguage === 'All' || lang === filterLanguage;
      const passDate = !updatedAfter || (repo.updatedAt instanceof Date ? repo.updatedAt : new Date(repo.updatedAt)) >= updatedAfter;
      if (passLang && passDate) grouped[lang].push(repo);
    });
    return grouped;
  }, [repos, filterLanguage, updatedAfter]);

  // Create planets in orbital rings by language
  const planets = useMemo(() => {
    const list: any[] = [];
    let i = 0;
    for (const [language, langRepos] of Object.entries(reposByLanguage)) {
      const angleStep = (2 * Math.PI) / langRepos.length;
      const radius = 6 + i * 3; // distance between languages
      langRepos.forEach((repo, idx) => {
        const angle = angleStep * idx;
        list.push({
          id: `${language}-${idx}`,
          repo,
          position: [
            radius * Math.cos(angle),
            (Math.random() - 0.5) * 2,
            radius * Math.sin(angle),
          ],
          color: new THREE.Color(
            (LANGUAGE_COLORS as any)[language] || '#7dd3fc' /* fallback cyan */
          ),
          size: 0.3 + Math.log10((repo.stars || 1) + 1) * 0.2,
        });
      });
      i++;
    }
    return list;
  }, [reposByLanguage]);

  // Slow galaxy rotation (group only, not the whole scene)
  const galaxyRef = useRef<THREE.Group>(null!);
  useFrame(() => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += 0.0012;
    }
  });

  return (
    <>
      {/* Lighting */}
      <hemisphereLight args={[0x5fd1ff, 0x0a0a1f, 0.4]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.1} color="#ffffff" />

      {/* Background */}
      <color attach="background" args={["#020617"]} />

      {/* Stars */}
      <Stars radius={100} depth={60} count={4000} factor={3.6} fade speed={0.8} />

      {/* Galaxy group */}
      <group ref={galaxyRef} position={offset || [0,0,0]}>
        {/* Planets */}
        {planets.map((p) => {
          const updatedAt = p.repo.updatedAt instanceof Date ? p.repo.updatedAt : new Date(p.repo.updatedAt);
          const daysSinceUpdate = Math.max(0, (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
          const activityBoost = Math.max(0.3, 1 - Math.min(daysSinceUpdate / 365, 1)); // newer -> brighter
          const isSelected = selectedRepo?.name === p.repo.name;
          const isHovered = hoveredId === p.id;
          const emissiveIntensity = 0.4 + activityBoost * 0.6 + (isHovered ? 0.2 : 0) + (isSelected ? 0.2 : 0);
          const sparkleCount = Math.min(30, Math.floor(Math.log10((p.repo.stars || 0) + 1) * 12 + (p.repo.forks || 0) * 0.2 + activityBoost * 8));
          return (
            <group key={p.id} position={p.position}>
              <mesh
                onClick={() => onPlanetClick(p.repo)}
                onPointerOver={(e) => { e.stopPropagation(); setHoveredId(p.id); document.body.style.cursor = 'pointer'; }}
                onPointerOut={(e) => { e.stopPropagation(); setHoveredId((id) => (id === p.id ? null : id)); document.body.style.cursor = 'default'; }}
                scale={isSelected || isHovered ? 1.6 : 1}
                castShadow
                receiveShadow
              >
                <sphereGeometry args={[p.size, 32, 32]} />
                <meshStandardMaterial
                  color={p.color}
                  emissive={p.color}
                  emissiveIntensity={emissiveIntensity}
                  roughness={0.35}
                  metalness={0.15}
                />
              </mesh>
              {sparkleCount > 0 && (
                <Sparkles
                  count={sparkleCount}
                  scale={p.size * 4}
                  size={1.5}
                  speed={0.5 + activityBoost}
                  color={(p.color as THREE.Color).getStyle()}
                />
              )}
              {/* Persistent label beside planet */}
              <Billboard position={[p.size * 1.6, 0, 0]} follow={true} lockX={false} lockY={false} lockZ={false}>
                <Text
                  anchorX="left"
                  anchorY="middle"
                  fontSize={Math.min(0.34, Math.max(0.12, p.size * 0.9))}
                  color="#e5e7eb"
                  outlineWidth={0.004}
                  outlineColor="#0a0a1f"
                  maxWidth={6}
                >
                  {p.repo.name.length > 28 ? `${p.repo.name.slice(0, 27)}…` : p.repo.name}
                </Text>
              </Billboard>
              {isHovered && (
                <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
                  <div style={{
                    padding: '6px 10px',
                    background: 'rgba(2,10,23,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#e5e7eb',
                    backdropFilter: 'blur(8px)'
                  }}>
                    <div style={{ fontWeight: 600 }}>{p.repo.name}</div>
                    {p.repo.language && (
                      <div style={{ opacity: 0.75 }}>{p.repo.language}</div>
                    )}
                  </div>
                </Html>
              )}
            </group>
          );
        })}

        {/* Galactic Core */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshStandardMaterial
            color="#66ccff"
            emissive="#88ccff"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* Fog for depth */}
      <fogExp2 attach="fog" args={["#0a0a1f", 0.015]} />
    </>
  );
}

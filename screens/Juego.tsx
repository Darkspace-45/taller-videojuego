import React, { useState, useEffect, useRef } from "react";
import { get, ref, set } from "firebase/database";
import { db } from "../config/Config";
import Canvas from "../components/Canvas";
import { Button, View } from "react-native";

export default function Juego() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [resources, setResources] = useState({ gold: 100, wood: 50 });
    const [gameOver, setGameOver] = useState(false);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [time, setTime] = useState(0);

    interface Building {
        x: number;
        y: number;
        type: "barracks" | "mine";
    }

    interface Unit {
        x: number;
        y: number;
        type: "soldier";
        health: number;
        damage: number;
        speed: number;
    }

    interface Enemy {
        x: number;
        y: number;
        health: number;
        damage: number;
    }

    const buildingCosts = {
        barracks: { gold: 50, wood: 20 },
        mine: { gold: 30, wood: 10 }
    };

    const unitCost = { gold: 20, wood: 10 };

    const enemyHealth = 50;
    const enemyDamage = 5;
    const enemySpeed = 2;

    // Función para recolectar recursos
    const collectResources = () => {
        setResources((prevResources) => ({
            gold: prevResources.gold + 1,
            wood: prevResources.wood + 0.5
        }));
    };

    // Función para construir edificios
    const buildBuilding = (x: number, y: number, type: "barracks" | "mine") => {
        const cost = buildingCosts[type];

        if (resources.gold >= cost.gold && resources.wood >= cost.wood) {
            setResources((prevResources) => ({
                gold: prevResources.gold - cost.gold,
                wood: prevResources.wood - cost.wood
            }));
            setBuildings((prevBuildings) => [...prevBuildings, { x, y, type }]);
        }
    };

    // Función para entrenar unidades
    const trainUnit = (x: number, y: number) => {
        if (resources.gold >= unitCost.gold && resources.wood >= unitCost.wood) {
            setResources((prevResources) => ({
                gold: prevResources.gold - unitCost.gold,
                wood: prevResources.wood - unitCost.wood
            }));
            const newUnit: Unit = { x, y, type: "soldier", health: 100, damage: 10, speed: 2 };
            setUnits((prevUnits) => [...prevUnits, newUnit]);
        }
    };

    // Función para generar enemigos
    const spawnEnemies = () => {
        if (time % 100 === 0) {
            const newEnemy: Enemy = {
                x: Math.random() * 800,
                y: 0,
                health: enemyHealth,
                damage: enemyDamage,
            };
            setEnemies((prevEnemies) => [...prevEnemies, newEnemy]);
        }
    };

    // Función para mover enemigos
    const moveEnemies = () => {
        setEnemies((prevEnemies) =>
            prevEnemies.map((enemy) => {
                return { ...enemy, y: enemy.y + enemySpeed };
            })
        );
    };

    // Función para detectar colisiones con unidades
    const checkUnitCollisions = () => {
        units.forEach((unit) => {
            enemies.forEach((enemy) => {
                if (Math.abs(unit.x - enemy.x) < 50 && Math.abs(unit.y - enemy.y) < 50) {
                    // Colisión: el enemigo ataca la unidad
                    unit.health -= enemy.damage;
                    if (unit.health <= 0) {
                        setUnits((prevUnits) => prevUnits.filter((u) => u !== unit));
                    }
                }
            });
        });
    };

    // Función para actualizar puntaje
    const updateScore = () => {
        const newScore = units.length * 10; // Example score calculation based on number of units
        setScore(newScore);
    };

    // Función para dibujar el juego
    const drawGame = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, 800, 600);

        // Dibujar recursos
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(`Gold: ${resources.gold}`, 10, 30);
        ctx.fillText(`Wood: ${resources.wood}`, 10, 60);

        // Dibujar edificios
        buildings.forEach((building) => {
            ctx.fillStyle = building.type === "barracks" ? "blue" : "green";
            ctx.fillRect(building.x, building.y, 50, 50);
        });

        // Dibujar unidades
        units.forEach((unit) => {
            ctx.fillStyle = "red";
            ctx.fillRect(unit.x, unit.y, 30, 30);
        });

        // Dibujar enemigos
        enemies.forEach((enemy) => {
            ctx.fillStyle = "orange";
            ctx.fillRect(enemy.x, enemy.y, 30, 30);
        });

        // Dibujar puntaje
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${score}`, 10, 90);
    };

    // Guardar puntaje en Firebase
    const saveScoreToFirebase = async () => {
        const scoreRef = ref(db, "scores/");
        const snapshot = await get(scoreRef);
        const currentScores = snapshot.val() || [];
        currentScores.push({ score, date: new Date().toISOString() });
        await set(ref(db, "scores/"), currentScores);
    };

    // Game Loop
    const updateGame = (ctx: CanvasRenderingContext2D) => {
        if (gameOver) {
            saveScoreToFirebase();
            return;
        }

        spawnEnemies();
        moveEnemies();
        checkUnitCollisions();
        updateScore();
        drawGame(ctx);
        setTime((prevTime) => prevTime + 1);

        requestAnimationFrame(() => updateGame(ctx));
    };

return (
    <View>
        <Canvas ref={canvasRef} width={800} height={600}></Canvas>
        <View>
            <Button title="Build Barracks" onPress={() => buildBuilding(100, 200, "barracks")} />
            <Button title="Build Mine" onPress={() => buildBuilding(300, 200, "mine")} />
            <Button title="Train Soldier" onPress={() => trainUnit(150, 250)} />
        </View>
    </View>
);
               
}

import '../edit.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import scene from './Scene';
import camera from './Camera';
import renderer from './Renderer';
import floors from './Floors';
import objects from './Objects';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var intersects = new THREE.Vector3();
var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

var toggle = false;

// walls = xValue, yValue, zValue, rotation, thickness, length, name, id
// floors = 
// entrances =
// stairs =

var tempwallPos =  [[],[],[],[],[],[],[],[]];
var tempentrancePos = [[],[]];
var tempfloorsPos = [[],[]];
var wallNo = 0;
var currentWall = -1;
var currentEntrance = -1;
var currentEntranceNode = -1;
var currentStairsNode = -1;
var currentHallwayNode = -1;
var currentObject = new THREE.Object3D;
var floorNo = 0;

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

const lengthDiv = document.createElement("div");
lengthDiv.textContent = "Length:"
const lengthLabel = new CSS2DObject(lengthDiv);
scene.add(lengthLabel)
lengthLabel.position.set(1000, 1000, 1000) 

const rotationDiv = document.createElement("div");
rotationDiv.textContent = "Rotation:"
const rotationLabel = new CSS2DObject(rotationDiv);
scene.add(rotationLabel)
rotationLabel.position.set(1000, 1000, 1000) 

const xDiv = document.createElement("div");
xDiv.textContent = "X:"
const xLabel = new CSS2DObject(xDiv);
scene.add(xLabel)
xLabel.position.set(1000, 1000, 1000) 

const zDiv = document.createElement("div");
zDiv.textContent = "Z:"
const zLabel = new CSS2DObject(zDiv);
scene.add(zLabel)
zLabel.position.set(1000, 1000, 1000) 

function loadObjects() {

}

function onMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera)
    raycaster.ray.intersectPlane(plane, intersects)

    if (toggle == true) {
        currentObject.position.set(intersects.x, intersects.y + 1, intersects.z)
        lengthLabel.position.set(intersects.x, intersects.y + 1.4, intersects.z) 
        lengthDiv.textContent = "Length:" + currentObject.scale.z
        rotationLabel.position.set(intersects.x, intersects.y + 1, intersects.z) 
        rotationDiv.textContent = "Rotation:" + currentObject.rotation.y.toFixed(2)
        xLabel.position.set(intersects.x, intersects.y + 0.6, intersects.z) 
        xDiv.textContent = "X:" + intersects.x.toFixed(2)
        zLabel.position.set(intersects.x, intersects.y + 0.2, intersects.z) 
        zDiv.textContent = "Z:" +  intersects.z.toFixed(2)
    }  
}

function onMouseClick( event ) {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(objects, false)
    
        if (toggle == false) {
            if (intersects.length > 0) {
            currentObject = scene.getObjectByName(intersects[0].object.name)
            toggle = true
            }
        } else {
            toggle = false
        }
    
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onMouseClick, false);

const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 5;
controls.maxDistance = 60;

var editButton = document.querySelector('.editButton');
var saveButton = document.querySelector('.saveButton');
var wallButton = document.querySelector('.wallButton');
var entranceButton = document.querySelector('.entranceButton');
var stairsButton = document.querySelector('.stairsButton');
var hallwayNodeButton = document.querySelector('.hallwayNodeButton');
var stairsNodeButton = document.querySelector('.stairsNodeButton');
var entranceNodeButton = document.querySelector('.entranceNodeButton');
var plusButton = document.querySelector('.plusButton');
var minusButton = document.querySelector('.minusButton');
var plus2Button = document.querySelector('.plus2Button');
var minus2Button = document.querySelector('.minus2Button');

editButton.addEventListener('click', function() {
    window.location.href ='index.html';
})

wallButton.addEventListener('click', function() {
currentWall += 1;
const wallTex = new THREE.TextureLoader().load('../textures/wall.png');
const geo = new THREE.BoxGeometry(0.1, 1, 1, 5);
const mat = new THREE.MeshBasicMaterial({map: wallTex, color: 0xFFF8E7, side: THREE.DoubleSide});
const wall = new THREE.Mesh(geo, mat);

const wallClone = wall.clone();
scene.add(wallClone);

wallClone.scale.y = 2;
wallClone.position.y = 1;
wallClone.name = 'wall' + currentWall;
wallClone.updateMatrix();
objects.push(wallClone);
})

entranceButton.addEventListener('click', function() {
    currentEntrance += 1;
    const entranceTex = new THREE.TextureLoader().load('../textures/wall2.jpg');
    const geo = new THREE.BoxGeometry(0.1, 1, 1, 5);
    const mat = new THREE.MeshBasicMaterial({map: entranceTex, color: 0xFFF8E7, side: THREE.DoubleSide});
    const entrance = new THREE.Mesh(geo, mat);
    
    const entranceClone = entrance.clone();
    scene.add(entranceClone);
    
    entranceClone.scale.y = 2;
    entranceClone.position.y = 1;
    entranceClone.name = 'entrance' + currentEntrance;
    entranceClone.updateMatrix();
    objects.push(entranceClone);
})

hallwayNodeButton.addEventListener('click', function() {
        currentHallwayNode += 1;
        const geo = new THREE.SphereGeometry(0.2);
        const mat = new THREE.MeshBasicMaterial({color: 0xff0000});
        const hallwayNode = new THREE.Mesh(geo, mat);
        
        const hallwayNodeClone = hallwayNode.clone();
        scene.add(hallwayNodeClone);
        
        hallwayNodeClone.position.y = 1;
        hallwayNodeClone.name = 'hallwayNode' + currentHallwayNode;
        hallwayNodeClone.updateMatrix();
        objects.push(hallwayNodeClone);
})

entranceNodeButton.addEventListener('click', function() {
            currentEntranceNode += 1;
            const geo = new THREE.SphereGeometry(0.2);
            const mat = new THREE.MeshBasicMaterial({color: 0x008000});
            const entranceNode = new THREE.Mesh(geo, mat);
            
            const entranceNodeClone = entranceNode.clone();
            scene.add(entranceNodeClone);
            
            entranceNodeClone.position.y = 1;
            entranceNodeClone.name = 'entranceNode' + " " +  currentEntranceNode;
            entranceNodeClone.updateMatrix();
            objects.push(entranceNodeClone);
})

stairsNodeButton.addEventListener('click', function() {
                currentStairsNode += 1;
                const geo = new THREE.SphereGeometry(0.2);
                const mat = new THREE.MeshBasicMaterial({color: 0x0000FF});
                const stairsNode = new THREE.Mesh(geo, mat);
                
                const stairsNodeClone = stairsNode.clone();
                scene.add(stairsNodeClone);
                
                stairsNodeClone.position.y = 1;
                stairsNodeClone.name = 'stairsNode' + " " + currentStairsNode;
                stairsNodeClone.updateMatrix();
                objects.push(stairsNodeClone);
})

plusButton.addEventListener('click', function() {
    currentObject.scale.z += 0.25;
    lengthDiv.textContent = "Length:" + currentObject.scale.z
})

minusButton.addEventListener('click', function() {
    if (currentObject.scale.z != 0) {
    currentObject.scale.z -= 0.25;
    lengthDiv.textContent = "Length:" + currentObject.scale.z
    }
})

plus2Button.addEventListener('click', function() {
    if (currentObject.rotation.y < 3.14) {
    currentObject.rotation.y += Math.PI / 12;
    rotationDiv.textContent = "Rotation:" + currentObject.rotation.y.toFixed(2)
    }
})

minus2Button.addEventListener('click', function() {
    if (currentObject.rotation.y > 0.1) {
    currentObject.rotation.y -= Math.PI / 12;
    rotationDiv.textContent = "Rotation:" + currentObject.rotation.y.toFixed(2)
    }
})

var empty = 0;
//walls = xValue, yValue, zValue, rotation, thickness, length, name, id


saveButton.addEventListener('click', function() {
    window.alert(objects.length)
    for (let x = 0; x < objects.length;x++) {
        if (objects[x].name.length == 5) {
            while (tempwallPos[empty][0] != undefined) {
                empty += 1;
            }
            tempwallPos[empty][0] = objects[x].position.x
            tempwallPos[empty][1] = objects[x].position.y
            tempwallPos[empty][2] = objects[x].position.z
            tempwallPos[empty][3] = objects[x].rotation.y
            tempwallPos[empty][4] = objects[x].scale.y
            tempwallPos[empty][5] = objects[x].scale.z
            tempwallPos[empty][6] = objects[x].name.substring(0, 4)
            tempwallPos[empty][7] = objects[x].name.substring(4, 5)
        } else {
        
        if (objects[x].name.length == 9) {
            while (tempentrancePos[empty][0] == undefined) {
                empty += 1;
            }
        }
    }
    }
})



function animate() {
 controls.update();
 renderer.render(scene, camera);
 labelRenderer.render(scene, camera);
 requestAnimationFrame(animate);
}

animate()
var scene, camera, fov, ratio, near, far, renderer, container,
    width, height,
    background, ground, cloudy,
    light1, light2,
    body, mesin, sayap, propeller, baling, ekor, Pesawat, 
    mouse;

var skyIndex = 0, skyIncrease = 1, skyTime = 0;
var skyColor = [
    0xD5E9FF,
    0xCAE4FF,
    0xBDDDFF,
    0xACD5FF,
    0x97CBFF,
    0x7DBEFF,
    0x70ABE5,
    0x6498CC,
    0x507AA3,
    0x406282
];

// Buat Scene
function createScene(){

    width = window.innerWidth;
    height = window.innerHeight;

    scene = new THREE.Scene();
    ratio = width / height;
    fov = 60;
    near = 1;
    far = 10000;
    camera = new THREE.PerspectiveCamera(
        fov, ratio, near, far
    );

    camera.position.x = 0;
    camera.position.y = 100;
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', resize, false);
}

// Buat Background
function createBackground(){
    var geometry = new THREE.PlaneGeometry(2500, 1500);
    var material = new THREE.MeshPhongMaterial({color: skyColor[skyIndex]});
    background = new THREE.Mesh(geometry, material);
    
    background.position.z = -600;
    scene.add(background);
}

// Buat pesawat 
function pesawat(){
    this.mesh = new THREE.Object3D();

    // Body
    var geometry = new THREE.BoxGeometry(65, 50, 50);
    var material = new THREE.MeshPhongMaterial({color: 0x800000, shading:THREE.FlatShading});
    body = new THREE.Mesh(geometry, material);
    body.position.x = 10;

    // Mesin
    var geomMesin = new THREE.BoxGeometry(25, 50, 50);
    var matMesin = new THREE.MeshPhongMaterial({color: 0xd8d0d1, shading:THREE.FlatShading});
    mesin = new THREE.Mesh(geomMesin, matMesin);
    mesin.position.x = 50;

    // Sayap 
    var geomSayap = new THREE.BoxGeometry(40, 8, 150);
    var matSayap = new THREE.MeshPhongMaterial({color: 0xFF4500, shading:THREE.FlatShading});
    sayap = new THREE.Mesh(geomSayap, matSayap);
    sayap.position.x = 5;

    // Propeller
    var geomPropeller = new THREE.BoxGeometry(15, 10, 1);
    var matPropeller = new THREE.MeshPhongMaterial({color: 0xA0522D, shading:THREE.FlatShading});
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.position.x = 65;

    // Baling-baling
    var geomBaling = new THREE.BoxGeometry(1, 80, 20);
    var matBaling = new THREE.MeshPhongMaterial({color: 0x624A2E, shading:THREE.FlatShading});
    baling = new THREE.Mesh(geomBaling, matBaling);
    baling.position.x = 5;

    // Ekor
    var geomEkor = new THREE.BoxGeometry(20, 20, 5);
    var matEkor = new THREE.MeshPhongMaterial({color: 0xA0522D, shading:THREE.FlatShading});
    ekor = new THREE.Mesh(geomEkor, matEkor);
    ekor.position.x = -32;
    ekor.position.y = 25;

    this.propeller.add(baling);
    
    body.castShadow = true;
    mesin.castShadow = true;
    sayap.castShadow = true;
    this.propeller.castShadow = true;
    baling.castShadow = true;
    ekor.castShadow = true;

    this.mesh.add(body);
    this.mesh.add(mesin);
    this.mesh.add(sayap);
    this.mesh.add(this.propeller);
    this.mesh.add(ekor);
}

function createPlane() {
    Pesawat = new pesawat();
    Pesawat.mesh.scale.set(.25, .25, .25);
    scene.add(Pesawat.mesh);
}

// Buat Ground
function createGround(){
    var geometry = new THREE.CylinderGeometry(600, 600, 800, 30,10);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    var mat = new THREE.MeshPhongMaterial({
        color: 0xED8E4A,
        opacity : 0.6,
        shading:THREE.FlatShading
    });
    ground = new THREE.Mesh(geometry, mat);
    ground.receiveShadow = true;

    ground.position.y = -600;
    scene.add(ground);
}

// Buat Awan
function cloneCloud(){
    this.mesh = new THREE.Object3D();
    this.nClouds = 40; 
    this.clouds = [];

    // Buat angle awan
    var stepAngle = Math.PI*2 / this.nClouds;
    for(var i=0; i<this.nClouds; i++){
        var c = new Cloud();
        this.clouds.push(c);
        var a = stepAngle*i;
        var h = 750 + Math.random()*200;
        c.mesh.position.y = Math.sin(a)*h;
        c.mesh.position.x = Math.cos(a)*h;
        c.mesh.position.z = -400-Math.random()*400;
        c.mesh.rotation.z = a + Math.PI/2;
        var s = 1+Math.random()*2;
        c.mesh.scale.set(s,s,s);
        this.mesh.add(c.mesh);
    }
}
  
function Cloud(){
    this.mesh = new THREE.Object3D();
    var geom = new THREE.SphereGeometry(15,15,15);
    var mat = new THREE.MeshPhongMaterial({
        color: 0xF0F0F0,
    });
    
    // Buat ukuran
    var nBlocs = 3+Math.floor(Math.random()*3);
    for (var i=0; i<nBlocs; i++ ){
        var m = new THREE.Mesh(geom.clone(), mat);
        m.position.x = i*15;
        m.position.y = Math.random()*10;
        m.position.z = Math.random()*10;
        m.rotation.z = Math.random()*Math.PI*2;
        m.rotation.y = Math.random()*Math.PI*2;
        var s = .1 + Math.random()*.9;
        m.scale.set(s,s,s);
        this.mesh.add(m);
    }
}

function createCloud(){
    cloudy = new cloneCloud();
    cloudy.mesh.position.y = -500;
    scene.add(cloudy.mesh);
}

// Buat Light
function createLight() {
    light1 = new THREE.AmbientLight(0xdc8874, .5);

    light2 = new THREE.DirectionalLight(0xffffff, .9);
    light2.position.set(150, 500, 500);
    light2.castShadow = true;
    light2.shadow.camera.left = -400;
    light2.shadow.camera.right = 400;
    light2.shadow.camera.top = 400;
    light2.shadow.camera.bottom = -400;
    light2.shadow.camera.near = 1;
    light2.shadow.camera.far = 1000;
    light2.shadow.mapSize.width = 1024;
    light2.shadow.mapSize.height = 1024;

    scene.add(light1);
    scene.add(light2);
}

// Animasi
function loop(){
    animatePlane();
    renderer.render(scene, camera);
    // Animate Sky
    if(skyTime < 120)
      skyTime++;
    else {
        if (skyIndex == 9 || (skyIncrease == 0 && skyIndex == 0))
            skyIncrease = !skyIncrease;
        
        if (skyIncrease)
            skyIndex++;
        else
            skyIndex--;

        background.material = new THREE.MeshPhongMaterial({color: skyColor[skyIndex]});
        skyTime = 0;
    }
    // Animate Ground
    ground.rotation.z += 0.005;
    // Animate Cloud
    cloudy.mesh.rotation.z += .01;
      
    requestAnimationFrame(loop);
}

// Initialisasi grafik
function init() {
    document.addEventListener('mousemove', handleMouseMove, false);
    createScene();
    createBackground();
    createGround();
    createCloud();
    createPlane();
    createLight();
    loop();
}

function animatePlane() {
    var targetX = normalize(mouse.x, -1, 1, -200, 200);
    var targetY = normalize(mouse.y, -1, 1,  20, 200);
    Pesawat.mesh.position.x = targetX;
    Pesawat.mesh.position.y = targetY;
    Pesawat.propeller.rotation.x += 0.25;
}

// Mengatur Kecepatan dan Tinggi Pesawat
function normalize(v, vmin, vmax, tmin, tmax) {
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax-vmin;
    var pc = (nv-vmin) / dv;
    var dt = tmax-tmin;
    var tv = tmin + (pc*dt);
    return tv;
}

mouse = { x: 0, y: 0 };
function handleMouseMove(event) {
    var tx = -1 + (event.clientX / width) * 2;
    var ty = 1 - (event.clientY / height) * 2;
    mouse = {x:tx, y:ty};
}

// Resize window
function resize() {
    height = window.innerHeight;
    width = window.innerWidth;
    renderer.setSize(width, height);
}

window.addEventListener('load', init, false);
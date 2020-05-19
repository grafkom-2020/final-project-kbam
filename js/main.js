var scene, camera, fov, ratio, near, far, renderer, container,
    width, height,
    background, ground, cloudy,
    light1, light2,
    body, mesin, sayap, propeller, baling, ekor, pesawat,
    mouse, powerUp = [], energyBar, random, speed;

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

// Fungsi Membentuk Pesawat
function Pesawat(){
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

// Buat Pesawat
function createPlane() {
    pesawat = new Pesawat();
    pesawat.mesh.scale.set(.25, .25, .25);
    scene.add(pesawat.mesh);
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

function Random(){
    this.randVal = 0;
    this.randOffset = new Date().getTime() % 3651 + 1;
    this.modular = 31627;
}

function nextVal(){
    random.randVal += random.randOffset;
    random.randVal *= random.randOffset;
    random.randVal %= random.modular;
    return random.randVal;
}

function Speed(){
    this.gameSpeed = 1.0;
}

function updateSpeed(){
    if(speed.gameSpeed < 4.0)
        speed.gameSpeed += .0001;
}

function initNumberClass(){
    random = new Random();
    speed = new Speed();
}

// Fungsi Membuat Power Up
function PowerUp(){
    this.b = nextVal()%101 - 150;
    this.r = 250;
    this.angle = nextVal()%31 + 270;
    this.rotateSpeed = (nextVal()%10 + 1) / 10;
    this.dist = 0;

    var geometry = new THREE.SphereGeometry(5, 15, 15);
    var material = new THREE.MeshPhongMaterial({
        color: 0x33F20B,
        opacity : 0.6,
        shading:THREE.FlatShading
    });

    this.mesh = new THREE.Mesh(geometry, material);
}

function createPowerUp(){
    for(var i=0; i<4; i++){
        var mesh = new PowerUp();
        powerUp.push(mesh);
        scene.add(powerUp[i].mesh);
    }
}

// Fungsi Membuat Energy Bar dari Pesawat
function EnergyBar() {
    this.life = 900;
    this.ratio = this.life / 10;
    var geometry = new THREE.BoxGeometry(30, 3, 3);
    var material = new THREE.MeshBasicMaterial({color: 0xFF0000});

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.y = 200;
    this.mesh.scale.set(this.life / this.ratio, 1, 1);
}

// Buat Energy Bar
function createEnergyBar() {
    energyBar = new EnergyBar();
    scene.add(energyBar.mesh);
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

function loop(){
    updateEnergyBar();
    updateSpeed();
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
    ground.rotation.z += 0.005 * speed.gameSpeed;
    // Animate Cloud
    cloudy.mesh.rotation.z += .01 * speed.gameSpeed;

    rotatePowerUp();

    requestAnimationFrame(loop);
}

function updateEnergyBar() {
    if (energyBar.life > 0)
        energyBar.life--;
    else
        location.replace("end.html");

    energyBar.mesh.scale.set(energyBar.life / energyBar.ratio, 1, 1);
}

// Fungsi Merotasi PowerUp dan Mengecek collision dengan pesawat
function rotatePowerUp() {
    for(var i=0; i<powerUp.length; i++){
        var b = powerUp[i].b;
        var r = powerUp[i].r;
    
        powerUp[i].angle += powerUp[i].rotateSpeed * speed.gameSpeed;
        var angle = powerUp[i].angle;
    
        if(angle > 360.0)
            powerUp[i].angle -= 360;
    
        var x = powerUp[i].mesh.position.x - pesawat.mesh.position.x;
        var y = powerUp[i].mesh.position.y - pesawat.mesh.position.y;
    
        x *= x;
        y *= y;
    
        powerUp[i].dist = x + y;
    
        if(powerUp[i].dist < 500){
            powerUp[i].b = nextVal()%101 - 150;
            powerUp[i].angle = nextVal()%31 + 270;
            angle = powerUp[i].angle;
            powerUp[i].rotateSpeed = (nextVal()%8 + 3) / 10;
            energyBar.life += 45;
            if(energyBar.life > 900)
                energyBar.life = 900;
        }
    
        powerUp[i].mesh.position.x = Math.cos(Math.PI * angle / 180) * r;
        powerUp[i].mesh.position.y = b + Math.sin(Math.PI * angle / 180) * r;
    }
}

// Initialisasi grafik
function init() {
    document.addEventListener('mousemove', handleMouseMove, false);

    createScene();
    createBackground();
    createGround();
    createCloud();
    createPlane();
    initNumberClass();
    createPowerUp();
    createEnergyBar();
    createLight();
    loop();
}

function animatePlane() {
    var targetX = normalize(mouse.x, -1, 1, -200, 200);
    var targetY = normalize(mouse.y, -1, 1,  20, 200);
    pesawat.mesh.position.x = targetX;
    pesawat.mesh.position.y = targetY;
    pesawat.propeller.rotation.x += 0.25;
}

// Mengatur Kecepatan dan Tinggi Pesawat
function normalize(v, vmin, vmax, tmin, tmax) {
    var dv = vmax-vmin;
    var pc = (v-vmin) / dv;
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

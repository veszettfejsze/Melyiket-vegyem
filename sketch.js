var myFont;
var table;
//var sizemin = 0;
//var sizemax = 0;
var upricemin = 0;
var upricemax = 0;
//var sizeleft;
//var sizeright;
var upriceup;
var upricedown;
var margx1 = 80;
var margx2 = 40;
var margx3 = 240;
var margx4 = 40;
var margy1 = 60; 
var margy2 = 60;
var margy3 = 40;
var padx = 40;
var pady = 40;

var upricewidth
//var sizewidth

var likey
//var priceheight

var boxx = 100;
var boxy = 250;
var distx = 40;


var q = 0;
var haziko1;
var haziko2;

var hazikok = [];
var todraw = 0;
var avguprice = 0;
var selectedidx = 0;

var mTexture;
    
function preload() {
    table = loadTable("lakasok 12v4.csv","csv","header");
    myFont = loadFont("../Arcon-Regular.otf");
    
}

function setup() {

    createCanvas(displayWidth, displayHeight);
    background(80);
    textFont(myFont);
    // textSize(24);
    // this part is drawing everything once into the mTexture object
    mTexture = createGraphics( displayWidth, displayHeight );
    mTexture.background(80);
    
    //defining area to draw records to
    upricewidth = displayWidth - padx * 2 - margx1 - margx2 - margx3 - margx4;
    likey = (displayHeight - margy1 - margy2 - margy3- boxy);
    
    //looking up min and max unit price
    var rows = table.getRows();

    upricemin = 9999999;
    upricemax = 0;
    
  for (var r = 0; r < rows.length; r++) {
    var uprice = rows[r].getNum("unitprice");
 
    if (uprice < upricemin) {
        upricemin = uprice
    }    
    if (uprice > upricemax) {
        upricemax = uprice
    }
        //print(upricemin);
        //print(upricemax);
  }
  
  var upricediff = upricemax-upricemin;

    //print(upricediff);
    upriceleft = margx1 + padx;
    upriceright = displayWidth -padx - margx2 - margx3 - margx4;
    likeup = margy1;
    likedown = margy1 + likey;
    
    for (var r = 0; r < rows.length; r++) {
    var lakasrec = {
        name : "",
        size : 0,
        price : 0,
        uprice : 0,
        url : "",
        ID : 0,
        distr : 0,
        loc : 0,
        prop : 0,
        cond : 0,
        extr : 0,
        liked : 0,
        parking : 0,
        view : 0,
        garden : 0,
        x : 0,
        y : 0,
        h : 0,
        w : 15,
    }
    lakasrec.name = rows[r].getString("name");
    lakasrec.size = rows[r].getNum("size");
    lakasrec.price = rows[r].getNum("price");
    lakasrec.uprice = rows[r].getNum("unitprice")
    lakasrec.url = rows[r].getString("url");
    lakasrec.ID = rows[r].getNum("ID");
    lakasrec.distr = rows[r].getNum("district");
    lakasrec.loc = rows[r].getNum("location")
    lakasrec.prop = rows[r].getNum("property")
    lakasrec.cond = rows[r].getNum("condition");
    lakasrec.extr = rows[r].getNum("extras");
    lakasrec.liked = rows[r].getNum("liked");
    lakasrec.parking = rows[r].getNum("parking");
    lakasrec.view = rows[r].getNum("view");
    lakasrec.garden = rows[r].getNum("garden");
    
    avguprice = avguprice + lakasrec.uprice;
    
    lakasrec.x = map(lakasrec.uprice, upricemin, upricemax, upriceleft, upriceright);
    lakasrec.y = map(lakasrec.loc + lakasrec.prop + lakasrec.cond + lakasrec.extr, 0, 12, margy1 + likey, margy1);
    lakasrec.h = map(lakasrec.loc + lakasrec.cond + lakasrec.prop + lakasrec.extr, 0, 12, 0, likey);
    
    //print(lakasrec.x);
    //print(lakasrec.y);
    //print(lakasrec.h);
    //hazikok[r] = new haziko(lakasrec.x, lakasrec.y, lakasrec.w, lakasrec.h,lakasrec.name,lakasrec.uprice);
    hazikok.push(new haziko(lakasrec.x, lakasrec.y, lakasrec.w, lakasrec.h,lakasrec.name,lakasrec.uprice, lakasrec.ID,lakasrec.size, lakasrec.price, lakasrec.distr, lakasrec.loc, lakasrec.prop, lakasrec.cond, lakasrec.extr, lakasrec.liked, lakasrec.parking, lakasrec.view, lakasrec.garden, lakasrec.url));
    }
    
    // draws a line at average unit price
    avguprice = avguprice / rows.length;
    avgx = map(avguprice, upricemin, upricemax, upriceleft, upriceright);
    mTexture.stroke(160);
    mTexture.line(avgx, margy1 - 15,avgx, margy1 + likey + 15);
    //text - average unit price
    mTexture.noStroke();
    mTexture.fill(160);
    mTexture.text("átlagos egységár (HUF/m2)",avgx + 8, margy1 - 4);

    //draws horizontal axis for unit prices
    var baseline = {
        x1 : 0,
        y1 : 0,
        x2 : 0,
        y2 : 0,
    }

    baseline.x1 = margx1;
    baseline.y1 = margy1 + likey;
    baseline.x2 = displayWidth - margx2-margx3-margx4;
    baseline.y2 = baseline.y1;
    mTexture.stroke(220);
    //vonalvastagság
    mTexture.line(baseline.x1,baseline.y1,baseline.x2,baseline.y2);
    
    //draws arrow tip on above line (tip length = lakasrec.w *1,5)
    mTexture.noStroke();
    mTexture.fill(200);
    mTexture.triangle(baseline.x2,baseline.y2 + 1, baseline.x2 + 1.5 * 15, baseline.y2 + 1, baseline.x2, baseline.y2 - 15 / 2);
    
    //text - egységár HUF / m2
    
    //draws horizontal dotted axises for preference values
    for (var x = 0; x < (baseline.x2 - margx1)/ 15; x++) {
    for (var i = 0; i < 4 ; i++) {
        var x1 = margx1 + x * 15;
        var y1 = margy1+ i * likey /4;
        mTexture.stroke(220);
        mTexture.point(x1, y1);   
        mTexture.line (margx1 - 20, y1,margx1, y1);
    }        
    }
    
    //text - mennyire tetszik

   for (var i=0; i< hazikok.length; i++) {
        hazikok[i].show();
   } 
image( mTexture, 0,0 );

}
function holvagyok(x,y) 
//defines which exact record polygon is selected
{
    var dist = 9999;
    var idx = -1;
    for (var r = 0; r < hazikok.length; r++){
        if ( (x >= hazikok[r].pointx && x <= (hazikok[r].pointx + hazikok[r].width))
              &&
             (y >= hazikok[r].pointy && y <= (hazikok[r].pointy + hazikok[r].length))
           ) {
            var d = abs(x - hazikok[r].pointx - hazikok[r].width / 2);
            if ( d < dist) {
                dist = d;
                idx = r;
            }
        }
    } 
    if (idx != -1){
        hazikok[idx].selected = 1;  
    }
    selectedidx = idx;
}
/*function mousePressed() {
    holvagyok(mouseX,mouseY);
    image( mTexture, 0,0 );
    if (selectedidx != -1){    
        hazikok[selectedidx].showCanvas();
        textSize(16);
        textAlign(LEFT);
        text(hazikok[selectedidx].name,hazikok[selectedidx].pointx + hazikok[selectedidx].width, hazikok[selectedidx].pointy + hazikok[selectedidx].length + 20);
    }
       
}
*/
function adatlap(i) 
//defines how the datasheet of the selected record should look like
{
    //hazikok[i].size
    noStroke();
    fill(135,206,255,130);
    rect(margx1, margy1 + likey + margy2, displayWidth - margx1 - margx2 - margx3 - margx4, displayHeight - margy3 * 2);
    fill(20);
    text(hazikok[i].name,margx1 + 15, margy1 + likey + margy2 + 20);
    textAlign(RIGHT);
    text(hazikok[i].ID, displayWidth - margx1 - margx2 - margx3 - margx4 - 5, margy1 + likey + margy2 + 20 );
    stroke (60);
    line(margx1 + 15, margy1 + likey + margy2 + 26, displayWidth - margx1  - margx2 - margx3 - margx4, margy1 + likey + margy2 + 26)
    textSize(14);
    textAlign(LEFT);
    text("MÉRET:",margx1 + 15, margy1 + likey + margy2 + 44 );
    text(hazikok[i].size, margx1 + 60, margy1 + likey + margy2 + 44);
    text("ÁR:",margx1 + 15, margy1 + likey + margy2 + 60);
    text(hazikok[i].price, margx1 + 60, margy1 + likey + margy2 + 60);
    //URL
    
}

function draw() {
    holvagyok(mouseX,mouseY);
    image( mTexture, 0,0 );
    if (selectedidx != -1){    
        hazikok[selectedidx].showCanvas();
        textSize(16);
        noStroke();
        textAlign(LEFT);
        text(hazikok[selectedidx].name,hazikok[selectedidx].pointx + hazikok[selectedidx].width, hazikok[selectedidx].pointy + hazikok[selectedidx].length + 20);
        adatlap(selectedidx);
    }
    
    /*if (todraw == 0){
   //draws horizontal axis for unit prices
    var baseline = {
        x1 : 0,
        y1 : 0,
        x2 : 0,
        y2 : 0,
    }

    baseline.x1 = margx1;
    baseline.y1 = margy1 + likey;
    baseline.x2 = displayWidth - margx2-margx3-margx4;
    baseline.y2 = baseline.y1;
    stroke(220);
    //vonalvastagság
    line(baseline.x1,baseline.y1,baseline.x2,baseline.y2);
    
    //draws arrow tip on above line (tip length = lakasrec.w *1,5)
    noStroke();
    fill(200);
    triangle(baseline.x2,baseline.y2 + 1, baseline.x2 + 1.5 * 15, baseline.y2 + 1, baseline.x2, baseline.y2 - 15 / 2);
    
    //draws horizontal dotted axises for preference values
    
    for (var x = 0; x < (baseline.x2 - margx1)/ 15; x++) {
    for (var i = 0; i < 4 ; i++) {
        var x1 = margx1 + x * 15;
        var y1 = margy1+ i * likey /4;
        stroke(220);
        point(x1, y1);   
        line (margx1 - 20, y1,margx1, y1);
    }
        
        
    }
    
    //line (pref_axis.x1 = x1(i))
    

        
    
    //haziko1.show();
   for (var i=0; i< hazikok.length; i++) {
        hazikok[i].show();
   }
   
    //haziko1.show();
    //haziko2.show();
    todraw = 1;
    
}*/
}

class haziko{
    constructor(x,y,w,l,name,uprice,ID,size,price,distr,loc,prop,cond,ext,liked,parking,view,garden,url){
        this.pointx=x;
        this.pointy=y;
        this.width=w;
        this.length=l;
        this.name=name;
        this.uprice=uprice;
        this.ID = ID;
        this.size = size;
        this.price = price;
        this.district = distr;
        this.locaton = loc;
        this.property = prop;
        this.condition = cond;
        this.extras = ext;
        this.liked = liked;
        this.parking = parking,
        this.view = view;
        this.garden = garden;
        this.url = url;
        this.brightness = 50;
        this.alpha = 100;
        this.selected = 0;
    }
    /*clicked(x,y){
        var d = dist(x,y,this.pointx,this.pointy)
        if (d < this.width * 2){
        this.brightness = 220;
        this.alpha = 255;
        this.show();
        console.log(this.ID);
        }
   }   
   */
    show(){
        //stroke(120);
        mTexture.noStroke();
        if (this.selected == 0) {
            mTexture.fill (this.brightness, this.alpha);    
        }
        else{
            mTexture.fill (220, 255);
        }
        mTexture.rect (this.pointx,this.pointy,this.width,this.length);
        mTexture.triangle (this.pointx,this.pointy,this.pointx + this.width / 2, this.pointy - this.width/2, this.pointx + this.width, this.pointy);
        mTexture.stroke (30);
        mTexture.line (this.pointx + this.width /2, this.pointy + this.length +1, this.pointx + this.width / 2, this.pointy + this.length + 15 );
        //shows unit prices on axis
        
        //text (this.name,this.pointx,margy1+likey+20);
        //text (this.uprice,this.pointx,margy1+likey+50);
    }

    showCanvas(){
        //stroke(120);
        noStroke();
        if (this.selected == 0) {
            fill (this.brightness, this.alpha);    
        }
        else{
            fill (220, 255);
        }
        rect (this.pointx,this.pointy,this.width,this.length);
        triangle (this.pointx,this.pointy,this.pointx + this.width / 2, this.pointy - this.width/2, this.pointx + this.width, this.pointy);
        stroke (30);
        line (this.pointx + this.width /2, this.pointy + this.length +1, this.pointx + this.width / 2, this.pointy + this.length + 15 );
        //text (this.name,this.pointx,margy1+likey+20);
        //text (this.uprice,this.pointx,margy1+likey+50);
    }
  
}
    
    

        

    

             
    
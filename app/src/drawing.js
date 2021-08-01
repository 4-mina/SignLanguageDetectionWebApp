const labelMap= {
    1:{name:'Hi',color:'red'},
    2:{name:'I Love You',color:'yellow'},
    3:{name:'Thank You',color:'green'},
    4:{name:'Yes',color:'blue'},
    5:{name:'No',color:'purple'},
}
export const draw=(boxes,classes,scores,threshold,imgWidth,imgHeight,ctx)=> {
    for(let i=0; i<boxes.length;i++){
        if(boxes[i] && classes[i] && scores[i]>threshold){
            //get the info from boxes
            const [y,x,height,width]=boxes[i]
            const text =classes[i]

            // the square's styling
            ctx.strokeStyle=labelMap[text]['color']
            ctx.linewidth=20
            ctx.fileStyle= 'white'
            ctx.font='40px Arial'
             
            ctx.beginPath()

            //Extract the name from the detected label and append its score
            //adjustment to compensate for our image scaling and positining above our box
            ctx.fillText(labelMap[text]['name']+' - '+ Math.round(scores[i]*100)/100, x*imgWidth,y*imgHeight+60)
            //drawing the rectangle: Since we are using a model based on 320x320, however, our imae size is 640x480
            //so we need to divide our imgWidth and imgHeight by 2 and 1.5 accordingly

            //Don't send the code before a decent adjustment of positions!!
            //ctx.rect(x*imgWidth*2,y*imgHeight*2,(width*imgWidth/2)+(width/2), (height*imgHeight/1.5)+(height/2));
            
            
            ctx.rect(y*imgHeight*5,x*imgWidth*8, (height*imgHeight/1.5),(width*imgWidth/2));
            ctx.stroke()

        }
    }
}
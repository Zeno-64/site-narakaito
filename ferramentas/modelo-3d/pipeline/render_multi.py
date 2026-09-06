import math, sys
import numpy as np
from PIL import Image
sys.path.insert(0,'.')
from glb_io import ler_glb_multi

ARQ, SAIDA = sys.argv[1], sys.argv[2]
W = H = 620
prims = ler_glb_multi(ARQ)
POS, IDX, COR = [], [], []
d = 0
for pos, idx, cor in prims:
    POS.append(pos); IDX.append(idx + d); COR.append(np.repeat(cor[None,:], len(idx), axis=0)); d += len(pos)
POS=np.concatenate(POS); IDX=np.concatenate(IDX); COR=np.concatenate(COR)
print(f"{len(IDX):,} triangulos")
centro=(POS.min(0)+POS.max(0))/2; esc=(POS.max(0)-POS.min(0)).max()
P=(POS-centro)/esc

quadros=[]
for ang in (10, 95, 190, 285):
    a=math.radians(ang)
    rot=np.array([[math.cos(a),0,math.sin(a)],[0,1,0],[-math.sin(a),0,math.cos(a)]],dtype=np.float32)
    p=P@rot.T
    sx=(p[:,0]*0.92+0.5)*W; sy=(0.5-p[:,1]*0.92)*H; sz=p[:,2]
    img=np.full((H,W,3),0.035,dtype=np.float32); zb=np.full((H,W),1e9,dtype=np.float32)
    a0,a1,a2=P[IDX[:,0]],P[IDX[:,1]],P[IDX[:,2]]
    n=np.cross(a1-a0,a2-a0); n/= (np.linalg.norm(n,axis=1,keepdims=True)+1e-9); n=n@rot.T
    L1=np.array([0.4,0.7,0.6]); L1/=np.linalg.norm(L1)
    L2=np.array([-0.6,0.2,-0.5]); L2/=np.linalg.norm(L2)
    dif=np.clip(n@L1,0,1)*0.95 + np.clip(n@L2,0,1)*0.35 + 0.16
    tons=np.clip(COR*dif[:,None],0,1)**0.85
    ordem=np.argsort(-(sz[IDX[:,0]]+sz[IDX[:,1]]+sz[IDX[:,2]]))
    for t in ordem:
        i0,i1,i2=IDX[t]
        x0,y0,z0=sx[i0],sy[i0],sz[i0]; x1,y1,z1=sx[i1],sy[i1],sz[i1]; x2,y2,z2=sx[i2],sy[i2],sz[i2]
        mnx,mxx=int(max(0,min(x0,x1,x2))),int(min(W-1,max(x0,x1,x2)))+1
        mny,mxy=int(max(0,min(y0,y1,y2))),int(min(H-1,max(y0,y1,y2)))+1
        if mnx>=mxx or mny>=mxy: continue
        area=(x1-x0)*(y2-y0)-(x2-x0)*(y1-y0)
        if area==0: continue
        ys,xs=np.mgrid[mny:mxy,mnx:mxx]; px,py=xs+0.5,ys+0.5
        w0=((x1-px)*(y2-py)-(x2-px)*(y1-py))/area
        w1=((x2-px)*(y0-py)-(x0-px)*(y2-py))/area
        w2=1-w0-w1
        dentro=(w0>=0)&(w1>=0)&(w2>=0)
        if not dentro.any(): continue
        z=w0*z0+w1*z1+w2*z2
        alvo=dentro&(z<zb[mny:mxy,mnx:mxx])
        if not alvo.any(): continue
        img[mny:mxy,mnx:mxx][alvo]=tons[t]; zb[mny:mxy,mnx:mxx][alvo]=z[alvo]
    quadros.append(Image.fromarray((np.clip(img,0,1)*255).astype(np.uint8)))
    print("angulo",ang,"ok",flush=True)
folha=Image.new("RGB",(W*len(quadros),H),(9,9,9))
for i,q in enumerate(quadros): folha.paste(q,(i*W,0))
folha.save(SAIDA); print("salvo",SAIDA)

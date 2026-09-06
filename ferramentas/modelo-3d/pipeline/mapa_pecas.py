"""Contact sheet: cada peca destacada em vermelho contra o resto em cinza."""
import math, os, sys
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0,'.')
from glb_io import ler_glb

PASTA="glb_simples"
ANG=math.radians(float(sys.argv[1]) if len(sys.argv)>1 else 95)
SAIDA=sys.argv[2] if len(sys.argv)>2 else "mapa_pecas.png"
CEL=300

partes=[]
for arq in sorted(os.listdir(PASTA)):
    if not arq.endswith(".glb"): continue
    pos,idx,cor=ler_glb(os.path.join(PASTA,arq))
    partes.append((arq[:-4],pos))

# quadro comum: so as pecas que estao no corpo montado (descarta as da origem)
NA_ORIGEM={"Arm_Left_3","Arm_Right_3","Hand_1_Sickle","Legs","Shoulder_armor_Right","Sickle_2"}
mundo=np.concatenate([p for n,p in partes if n not in NA_ORIGEM])
centro=(mundo.min(0)+mundo.max(0))/2
esc=(mundo.max(0)-mundo.min(0)).max()

rot=np.array([[math.cos(ANG),0,math.sin(ANG)],[0,1,0],[-math.sin(ANG),0,math.cos(ANG)]],dtype=np.float32)
def proj(p):
    q=((p-centro)/esc)@rot.T
    return ((q[:,0]*0.92+0.5)*CEL).astype(np.int32), ((0.5-q[:,1]*0.92)*CEL).astype(np.int32), q[:,2]

fundo_x,fundo_y,fundo_z=[],[],[]
for n,p in partes:
    if n in NA_ORIGEM: continue
    x,y,z=proj(p); fundo_x.append(x); fundo_y.append(y); fundo_z.append(z)
FX=np.concatenate(fundo_x); FY=np.concatenate(fundo_y); FZ=np.concatenate(fundo_z)

cols=7; rows=(len(partes)+cols-1)//cols
folha=Image.new("RGB",(CEL*cols,(CEL+18)*rows),(6,6,6))
d=ImageDraw.Draw(folha)
for i,(nome,p) in enumerate(partes):
    img=np.zeros((CEL,CEL,3),dtype=np.uint8)
    ok=(FX>=0)&(FX<CEL)&(FY>=0)&(FY<CEL)
    img[FY[ok],FX[ok]]=(60,60,66)
    x,y,z=proj(p)
    ok2=(x>=0)&(x<CEL)&(y>=0)&(y<CEL)
    img[y[ok2],x[ok2]]=(255,70,50)
    r,c=divmod(i,cols); yy=r*(CEL+18)
    folha.paste(Image.fromarray(img),(c*CEL,yy+18))
    d.text((c*CEL+4,yy+4), f"{nome}", fill=(255,200,120))
folha.save(SAIDA); print("salvo",SAIDA,folha.size)

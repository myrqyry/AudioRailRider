var ao=Object.defineProperty;var oo=(t,n,e)=>n in t?ao(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e;var N=(t,n,e)=>oo(t,typeof n!="symbol"?n+"":n,e);import{r as dt,j as Zr}from"./index-BzHxtUH_.js";import{c as co,N as nn,S as lo,C as Pe,F as Sa,M as ft,V as z,R as uo,a as Et,w as wi,W as kt,b as ot,L as Yn,H as Oi,U as hn,D as Lt,B as xt,d as mn,t as fo,e as po,f as Bi,p as ho,g as mo,E as go,h as lt,P as jn,A as _o,i as Xi,j as bt,k as Ui,l as Or,m as ni,n as ii,o as Ma,q as vo,r as Cn,s as Li,u as So,v as Mo,x as Bn,O as Eo,y as To,z as xo,G as Ao,I as yo,J as bo,K as wo,Q as Ro,T as Co,X as Po,Y as Uo,Z as Lo,_ as Io,$ as Do,a0 as No,a1 as Fo,a2 as Oo,a3 as Bo,a4 as qi,a5 as Pn,a6 as oi,a7 as ko,a8 as dn,a9 as Go,aa as Vo,ab as Ho,ac as zo,ad as Ea,ae as Wo,af as Xo,ag as qo,ah as Br,ai as Ve,aj as Yo,ak as Ko,al as $o,am as Ct,an as gn,ao as _t,ap as wt,aq as Ta,ar as pn,as as Xt,at as Ii,au as xa,av as Aa,aw as ya,ax as Di,ay as Qo,az as Zo,aA as jo,aB as ba,aC as Gt,aD as Jo,aE as ec,aF as tc,aG as wa,aH as nc,aI as Ra,aJ as Ca,aK as Yi,aL as Ki,aM as $i,aN as Qi,aO as je,aP as jr,aQ as Jr,aR as es,aS as ts,aT as ns,aU as is,aV as rs,aW as ss,aX as as,aY as os,aZ as cs,a_ as ls,a$ as us,b0 as fs,b1 as ds,b2 as ps,b3 as hs,b4 as ms,b5 as gs,b6 as _s,b7 as vs,b8 as Zi,b9 as Ss,ba as Ms,bb as ic,bc as Es,bd as Ts,be as xs,bf as mr,bg as gr,bh as _r,bi as vr,bj as Sr,bk as Mr,bl as Er,bm as rc,bn as As,bo as sc,bp as Ri,bq as ac,br as ys,bs,bt as rn,bu as Ni,bv as Tr,bw as oc,bx as Pa,by as cc,bz as Mt,bA as ki,bB as lc,bC as uc,bD as Ua,bE as La,bF as ws,bG as Ia,bH as Rs,bI as Da,bJ as ri,bK as Dn,bL as Na,bM as Fa,bN as fc,bO as dc,bP as pc,bQ as Cs,bR as hc,bS as mc,bT as gc,bU as _c,bV as vc,bW as Sc,bX as Mc,bY as Ec,bZ as Tc,b_ as xc,b$ as Ac,c0 as yc,c1 as bc,c2 as wc,c3 as Rc,c4 as Cc,c5 as Pc,c6 as Oa,c7 as at,c8 as Uc,c9 as Lc,ca as Ps,cb as Ic,cc as Ee,cd as Yt,ce as xr,cf as $t,cg as Kn,ch as Dc,ci as zt,cj as Ba,ck as Nc,cl as Fc,cm as ci,cn as Oc,co as Us,cp as ka,cq as Bc,cr as $n,cs as kn,ct as Ga,cu as kc,cv as Va,cw as Ls,cx as Gc,cy as Is,cz as Ar,cA as Un,cB as Vc,cC as Hc}from"./App-cuwfcLqo.js";import"./ToastProvider-nF4Lwaba.js";/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Ha(){let t=null,n=!1,e=null,i=null;function r(s,a){e(s,a),i=t.requestAnimationFrame(r)}return{start:function(){n!==!0&&e!==null&&(i=t.requestAnimationFrame(r),n=!0)},stop:function(){t.cancelAnimationFrame(i),n=!1},setAnimationLoop:function(s){e=s},setContext:function(s){t=s}}}function zc(t){const n=new WeakMap;function e(o,c){const f=o.array,m=o.usage,p=f.byteLength,l=t.createBuffer();t.bindBuffer(c,l),t.bufferData(c,f,m),o.onUploadCallback();let d;if(f instanceof Float32Array)d=t.FLOAT;else if(typeof Float16Array<"u"&&f instanceof Float16Array)d=t.HALF_FLOAT;else if(f instanceof Uint16Array)o.isFloat16BufferAttribute?d=t.HALF_FLOAT:d=t.UNSIGNED_SHORT;else if(f instanceof Int16Array)d=t.SHORT;else if(f instanceof Uint32Array)d=t.UNSIGNED_INT;else if(f instanceof Int32Array)d=t.INT;else if(f instanceof Int8Array)d=t.BYTE;else if(f instanceof Uint8Array)d=t.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)d=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:l,type:d,bytesPerElement:f.BYTES_PER_ELEMENT,version:o.version,size:p}}function i(o,c,f){const m=c.array,p=c.updateRanges;if(t.bindBuffer(f,o),p.length===0)t.bufferSubData(f,0,m);else{p.sort((d,S)=>d.start-S.start);let l=0;for(let d=1;d<p.length;d++){const S=p[l],E=p[d];E.start<=S.start+S.count+1?S.count=Math.max(S.count,E.start+E.count-S.start):(++l,p[l]=E)}p.length=l+1;for(let d=0,S=p.length;d<S;d++){const E=p[d];t.bufferSubData(f,E.start*m.BYTES_PER_ELEMENT,m,E.start,E.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),n.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=n.get(o);c&&(t.deleteBuffer(c.buffer),n.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const m=n.get(o);(!m||m.version<o.version)&&n.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const f=n.get(o);if(f===void 0)n.set(o,e(o,c));else if(f.version<o.version){if(f.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(f.buffer,o,c),f.version=o.version}}return{get:r,remove:s,update:a}}var Wc=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Xc=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,qc=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Yc=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kc=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,$c=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Qc=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Zc=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,jc=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Jc=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,el=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,tl=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,nl=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,il=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,rl=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,sl=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,al=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ol=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cl=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ll=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ul=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,fl=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,dl=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,pl=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,hl=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ml=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,gl=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,_l=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vl=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Sl=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ml="gl_FragColor = linearToOutputTexel( gl_FragColor );",El=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Tl=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,xl=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Al=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,yl=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,bl=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,wl=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Rl=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Cl=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Pl=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ul=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ll=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Il=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Dl=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Nl=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Fl=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ol=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Bl=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,kl=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gl=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vl=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Hl=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,zl=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Wl=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Xl=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ql=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Yl=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kl=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$l=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ql=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zl=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,jl=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Jl=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,eu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,tu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,nu=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,iu=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ru=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,su=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,au=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ou=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,cu=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,lu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,uu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fu=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,du=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,pu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,hu=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,mu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,gu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,_u=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vu=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Su=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Mu=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Eu=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Tu=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,xu=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Au=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,yu=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,bu=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,wu=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ru=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Cu=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Pu=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Uu=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Lu=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Iu=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Du=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Nu=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Fu=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ou=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Bu=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,ku=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Hu=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const zu=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Wu=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qu=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ku=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$u=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Qu=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Zu=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ju=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Ju=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ef=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tf=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,nf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,sf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,af=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,of=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cf=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,lf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ff=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,df=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,mf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_f=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vf=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Sf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Mf=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ef=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Tf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Fe={alphahash_fragment:Wc,alphahash_pars_fragment:Xc,alphamap_fragment:qc,alphamap_pars_fragment:Yc,alphatest_fragment:Kc,alphatest_pars_fragment:$c,aomap_fragment:Qc,aomap_pars_fragment:Zc,batching_pars_vertex:jc,batching_vertex:Jc,begin_vertex:el,beginnormal_vertex:tl,bsdfs:nl,iridescence_fragment:il,bumpmap_pars_fragment:rl,clipping_planes_fragment:sl,clipping_planes_pars_fragment:al,clipping_planes_pars_vertex:ol,clipping_planes_vertex:cl,color_fragment:ll,color_pars_fragment:ul,color_pars_vertex:fl,color_vertex:dl,common:pl,cube_uv_reflection_fragment:hl,defaultnormal_vertex:ml,displacementmap_pars_vertex:gl,displacementmap_vertex:_l,emissivemap_fragment:vl,emissivemap_pars_fragment:Sl,colorspace_fragment:Ml,colorspace_pars_fragment:El,envmap_fragment:Tl,envmap_common_pars_fragment:xl,envmap_pars_fragment:Al,envmap_pars_vertex:yl,envmap_physical_pars_fragment:Fl,envmap_vertex:bl,fog_vertex:wl,fog_pars_vertex:Rl,fog_fragment:Cl,fog_pars_fragment:Pl,gradientmap_pars_fragment:Ul,lightmap_pars_fragment:Ll,lights_lambert_fragment:Il,lights_lambert_pars_fragment:Dl,lights_pars_begin:Nl,lights_toon_fragment:Ol,lights_toon_pars_fragment:Bl,lights_phong_fragment:kl,lights_phong_pars_fragment:Gl,lights_physical_fragment:Vl,lights_physical_pars_fragment:Hl,lights_fragment_begin:zl,lights_fragment_maps:Wl,lights_fragment_end:Xl,logdepthbuf_fragment:ql,logdepthbuf_pars_fragment:Yl,logdepthbuf_pars_vertex:Kl,logdepthbuf_vertex:$l,map_fragment:Ql,map_pars_fragment:Zl,map_particle_fragment:jl,map_particle_pars_fragment:Jl,metalnessmap_fragment:eu,metalnessmap_pars_fragment:tu,morphinstance_vertex:nu,morphcolor_vertex:iu,morphnormal_vertex:ru,morphtarget_pars_vertex:su,morphtarget_vertex:au,normal_fragment_begin:ou,normal_fragment_maps:cu,normal_pars_fragment:lu,normal_pars_vertex:uu,normal_vertex:fu,normalmap_pars_fragment:du,clearcoat_normal_fragment_begin:pu,clearcoat_normal_fragment_maps:hu,clearcoat_pars_fragment:mu,iridescence_pars_fragment:gu,opaque_fragment:_u,packing:vu,premultiplied_alpha_fragment:Su,project_vertex:Mu,dithering_fragment:Eu,dithering_pars_fragment:Tu,roughnessmap_fragment:xu,roughnessmap_pars_fragment:Au,shadowmap_pars_fragment:yu,shadowmap_pars_vertex:bu,shadowmap_vertex:wu,shadowmask_pars_fragment:Ru,skinbase_vertex:Cu,skinning_pars_vertex:Pu,skinning_vertex:Uu,skinnormal_vertex:Lu,specularmap_fragment:Iu,specularmap_pars_fragment:Du,tonemapping_fragment:Nu,tonemapping_pars_fragment:Fu,transmission_fragment:Ou,transmission_pars_fragment:Bu,uv_pars_fragment:ku,uv_pars_vertex:Gu,uv_vertex:Vu,worldpos_vertex:Hu,background_vert:zu,background_frag:Wu,backgroundCube_vert:Xu,backgroundCube_frag:qu,cube_vert:Yu,cube_frag:Ku,depth_vert:$u,depth_frag:Qu,distanceRGBA_vert:Zu,distanceRGBA_frag:ju,equirect_vert:Ju,equirect_frag:ef,linedashed_vert:tf,linedashed_frag:nf,meshbasic_vert:rf,meshbasic_frag:sf,meshlambert_vert:af,meshlambert_frag:of,meshmatcap_vert:cf,meshmatcap_frag:lf,meshnormal_vert:uf,meshnormal_frag:ff,meshphong_vert:df,meshphong_frag:pf,meshphysical_vert:hf,meshphysical_frag:mf,meshtoon_vert:gf,meshtoon_frag:_f,points_vert:vf,points_frag:Sf,shadow_vert:Mf,shadow_frag:Ef,sprite_vert:Tf,sprite_frag:xf},re={common:{diffuse:{value:new Pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new Pe(16777215)},opacity:{value:1},center:{value:new lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},Ht={basic:{uniforms:Mt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.fog]),vertexShader:Fe.meshbasic_vert,fragmentShader:Fe.meshbasic_frag},lambert:{uniforms:Mt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Fe.meshlambert_vert,fragmentShader:Fe.meshlambert_frag},phong:{uniforms:Mt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new Pe(0)},specular:{value:new Pe(1118481)},shininess:{value:30}}]),vertexShader:Fe.meshphong_vert,fragmentShader:Fe.meshphong_frag},standard:{uniforms:Mt([re.common,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.roughnessmap,re.metalnessmap,re.fog,re.lights,{emissive:{value:new Pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag},toon:{uniforms:Mt([re.common,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.gradientmap,re.fog,re.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Fe.meshtoon_vert,fragmentShader:Fe.meshtoon_frag},matcap:{uniforms:Mt([re.common,re.bumpmap,re.normalmap,re.displacementmap,re.fog,{matcap:{value:null}}]),vertexShader:Fe.meshmatcap_vert,fragmentShader:Fe.meshmatcap_frag},points:{uniforms:Mt([re.points,re.fog]),vertexShader:Fe.points_vert,fragmentShader:Fe.points_frag},dashed:{uniforms:Mt([re.common,re.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Fe.linedashed_vert,fragmentShader:Fe.linedashed_frag},depth:{uniforms:Mt([re.common,re.displacementmap]),vertexShader:Fe.depth_vert,fragmentShader:Fe.depth_frag},normal:{uniforms:Mt([re.common,re.bumpmap,re.normalmap,re.displacementmap,{opacity:{value:1}}]),vertexShader:Fe.meshnormal_vert,fragmentShader:Fe.meshnormal_frag},sprite:{uniforms:Mt([re.sprite,re.fog]),vertexShader:Fe.sprite_vert,fragmentShader:Fe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Fe.background_vert,fragmentShader:Fe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:Fe.backgroundCube_vert,fragmentShader:Fe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Fe.cube_vert,fragmentShader:Fe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Fe.equirect_vert,fragmentShader:Fe.equirect_frag},distanceRGBA:{uniforms:Mt([re.common,re.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Fe.distanceRGBA_vert,fragmentShader:Fe.distanceRGBA_frag},shadow:{uniforms:Mt([re.lights,re.fog,{color:{value:new Pe(0)},opacity:{value:1}}]),vertexShader:Fe.shadow_vert,fragmentShader:Fe.shadow_frag}};Ht.physical={uniforms:Mt([Ht.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new Pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new Pe(0)},specularColor:{value:new Pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag};const li={r:0,b:0,g:0},cn=new Ia,Af=new ft;function yf(t,n,e,i,r,s,a){const o=new Pe(0);let c=s===!0?0:1,f,m,p=null,l=0,d=null;function S(T){let x=T.isScene===!0?T.background:null;return x&&x.isTexture&&(x=(T.backgroundBlurriness>0?e:n).get(x)),x}function E(T){let x=!1;const b=S(T);b===null?u(o,c):b&&b.isColor&&(u(b,1),x=!0);const A=t.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,a):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(t.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function h(T,x){const b=S(x);b&&(b.isCubeTexture||b.mapping===ki)?(m===void 0&&(m=new wt(new La(1,1,1),new Ct({name:"BackgroundCubeMaterial",uniforms:ws(Ht.backgroundCube.uniforms),vertexShader:Ht.backgroundCube.vertexShader,fragmentShader:Ht.backgroundCube.fragmentShader,side:xt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),m.geometry.deleteAttribute("normal"),m.geometry.deleteAttribute("uv"),m.onBeforeRender=function(A,w,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(m.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(m)),cn.copy(x.backgroundRotation),cn.x*=-1,cn.y*=-1,cn.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(cn.y*=-1,cn.z*=-1),m.material.uniforms.envMap.value=b,m.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,m.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,m.material.uniforms.backgroundRotation.value.setFromMatrix4(Af.makeRotationFromEuler(cn)),m.material.toneMapped=ot.getTransfer(b.colorSpace)!==je,(p!==b||l!==b.version||d!==t.toneMapping)&&(m.material.needsUpdate=!0,p=b,l=b.version,d=t.toneMapping),m.layers.enableAll(),T.unshift(m,m.geometry,m.material,0,0,null)):b&&b.isTexture&&(f===void 0&&(f=new wt(new Di(2,2),new Ct({name:"BackgroundMaterial",uniforms:ws(Ht.background.uniforms),vertexShader:Ht.background.vertexShader,fragmentShader:Ht.background.fragmentShader,side:mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),f.geometry.deleteAttribute("normal"),Object.defineProperty(f.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(f)),f.material.uniforms.t2D.value=b,f.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,f.material.toneMapped=ot.getTransfer(b.colorSpace)!==je,b.matrixAutoUpdate===!0&&b.updateMatrix(),f.material.uniforms.uvTransform.value.copy(b.matrix),(p!==b||l!==b.version||d!==t.toneMapping)&&(f.material.needsUpdate=!0,p=b,l=b.version,d=t.toneMapping),f.layers.enableAll(),T.unshift(f,f.geometry,f.material,0,0,null))}function u(T,x){T.getRGB(li,Ua(t)),i.buffers.color.setClear(li.r,li.g,li.b,x,a)}function M(){m!==void 0&&(m.geometry.dispose(),m.material.dispose(),m=void 0),f!==void 0&&(f.geometry.dispose(),f.material.dispose(),f=void 0)}return{getClearColor:function(){return o},setClearColor:function(T,x=1){o.set(T),c=x,u(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(T){c=T,u(o,c)},render:E,addToRenderList:h,dispose:M}}function bf(t,n){const e=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=l(null);let s=r,a=!1;function o(g,P,U,I,B){let X=!1;const G=p(I,U,P);s!==G&&(s=G,f(s.object)),X=d(g,I,U,B),X&&S(g,I,U,B),B!==null&&n.update(B,t.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,x(g,P,U,I),B!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,n.get(B).buffer))}function c(){return t.createVertexArray()}function f(g){return t.bindVertexArray(g)}function m(g){return t.deleteVertexArray(g)}function p(g,P,U){const I=U.wireframe===!0;let B=i[g.id];B===void 0&&(B={},i[g.id]=B);let X=B[P.id];X===void 0&&(X={},B[P.id]=X);let G=X[I];return G===void 0&&(G=l(c()),X[I]=G),G}function l(g){const P=[],U=[],I=[];for(let B=0;B<e;B++)P[B]=0,U[B]=0,I[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:U,attributeDivisors:I,object:g,attributes:{},index:null}}function d(g,P,U,I){const B=s.attributes,X=P.attributes;let G=0;const ee=U.getAttributes();for(const W in ee)if(ee[W].location>=0){const ye=B[W];let Re=X[W];if(Re===void 0&&(W==="instanceMatrix"&&g.instanceMatrix&&(Re=g.instanceMatrix),W==="instanceColor"&&g.instanceColor&&(Re=g.instanceColor)),ye===void 0||ye.attribute!==Re||Re&&ye.data!==Re.data)return!0;G++}return s.attributesNum!==G||s.index!==I}function S(g,P,U,I){const B={},X=P.attributes;let G=0;const ee=U.getAttributes();for(const W in ee)if(ee[W].location>=0){let ye=X[W];ye===void 0&&(W==="instanceMatrix"&&g.instanceMatrix&&(ye=g.instanceMatrix),W==="instanceColor"&&g.instanceColor&&(ye=g.instanceColor));const Re={};Re.attribute=ye,ye&&ye.data&&(Re.data=ye.data),B[W]=Re,G++}s.attributes=B,s.attributesNum=G,s.index=I}function E(){const g=s.newAttributes;for(let P=0,U=g.length;P<U;P++)g[P]=0}function h(g){u(g,0)}function u(g,P){const U=s.newAttributes,I=s.enabledAttributes,B=s.attributeDivisors;U[g]=1,I[g]===0&&(t.enableVertexAttribArray(g),I[g]=1),B[g]!==P&&(t.vertexAttribDivisor(g,P),B[g]=P)}function M(){const g=s.newAttributes,P=s.enabledAttributes;for(let U=0,I=P.length;U<I;U++)P[U]!==g[U]&&(t.disableVertexAttribArray(U),P[U]=0)}function T(g,P,U,I,B,X,G){G===!0?t.vertexAttribIPointer(g,P,U,B,X):t.vertexAttribPointer(g,P,U,I,B,X)}function x(g,P,U,I){E();const B=I.attributes,X=U.getAttributes(),G=P.defaultAttributeValues;for(const ee in X){const W=X[ee];if(W.location>=0){let fe=B[ee];if(fe===void 0&&(ee==="instanceMatrix"&&g.instanceMatrix&&(fe=g.instanceMatrix),ee==="instanceColor"&&g.instanceColor&&(fe=g.instanceColor)),fe!==void 0){const ye=fe.normalized,Re=fe.itemSize,Oe=n.get(fe);if(Oe===void 0)continue;const qe=Oe.buffer,K=Oe.type,ne=Oe.bytesPerElement,Se=K===t.INT||K===t.UNSIGNED_INT||fe.gpuType===ba;if(fe.isInterleavedBufferAttribute){const ce=fe.data,Me=ce.stride,He=fe.offset;if(ce.isInstancedInterleavedBuffer){for(let Ce=0;Ce<W.locationSize;Ce++)u(W.location+Ce,ce.meshPerAttribute);g.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let Ce=0;Ce<W.locationSize;Ce++)h(W.location+Ce);t.bindBuffer(t.ARRAY_BUFFER,qe);for(let Ce=0;Ce<W.locationSize;Ce++)T(W.location+Ce,Re/W.locationSize,K,ye,Me*ne,(He+Re/W.locationSize*Ce)*ne,Se)}else{if(fe.isInstancedBufferAttribute){for(let ce=0;ce<W.locationSize;ce++)u(W.location+ce,fe.meshPerAttribute);g.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let ce=0;ce<W.locationSize;ce++)h(W.location+ce);t.bindBuffer(t.ARRAY_BUFFER,qe);for(let ce=0;ce<W.locationSize;ce++)T(W.location+ce,Re/W.locationSize,K,ye,Re*ne,Re/W.locationSize*ce*ne,Se)}}else if(G!==void 0){const ye=G[ee];if(ye!==void 0)switch(ye.length){case 2:t.vertexAttrib2fv(W.location,ye);break;case 3:t.vertexAttrib3fv(W.location,ye);break;case 4:t.vertexAttrib4fv(W.location,ye);break;default:t.vertexAttrib1fv(W.location,ye)}}}}M()}function b(){R();for(const g in i){const P=i[g];for(const U in P){const I=P[U];for(const B in I)m(I[B].object),delete I[B];delete P[U]}delete i[g]}}function A(g){if(i[g.id]===void 0)return;const P=i[g.id];for(const U in P){const I=P[U];for(const B in I)m(I[B].object),delete I[B];delete P[U]}delete i[g.id]}function w(g){for(const P in i){const U=i[P];if(U[g.id]===void 0)continue;const I=U[g.id];for(const B in I)m(I[B].object),delete I[B];delete U[g.id]}}function R(){_(),a=!0,s!==r&&(s=r,f(s.object))}function _(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:R,resetDefaultState:_,dispose:b,releaseStatesOfGeometry:A,releaseStatesOfProgram:w,initAttributes:E,enableAttribute:h,disableUnusedAttributes:M}}function wf(t,n,e){let i;function r(f){i=f}function s(f,m){t.drawArrays(i,f,m),e.update(m,i,1)}function a(f,m,p){p!==0&&(t.drawArraysInstanced(i,f,m,p),e.update(m,i,p))}function o(f,m,p){if(p===0)return;n.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,f,0,m,0,p);let d=0;for(let S=0;S<p;S++)d+=m[S];e.update(d,i,1)}function c(f,m,p,l){if(p===0)return;const d=n.get("WEBGL_multi_draw");if(d===null)for(let S=0;S<f.length;S++)a(f[S],m[S],l[S]);else{d.multiDrawArraysInstancedWEBGL(i,f,0,m,0,l,0,p);let S=0;for(let E=0;E<p;E++)S+=m[E]*l[E];e.update(S,i,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Rf(t,n,e,i){let r;function s(){if(r!==void 0)return r;if(n.has("EXT_texture_filter_anisotropic")===!0){const w=n.get("EXT_texture_filter_anisotropic");r=t.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(w){return!(w!==bt&&i.convert(w)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const R=w===Oi&&(n.has("EXT_color_buffer_half_float")||n.has("EXT_color_buffer_float"));return!(w!==hn&&i.convert(w)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==Gt&&!R)}function c(w){if(w==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let f=e.precision!==void 0?e.precision:"highp";const m=c(f);m!==f&&(console.warn("THREE.WebGLRenderer:",f,"not supported, using",m,"instead."),f=m);const p=e.logarithmicDepthBuffer===!0,l=e.reverseDepthBuffer===!0&&n.has("EXT_clip_control"),d=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),S=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=t.getParameter(t.MAX_TEXTURE_SIZE),h=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),u=t.getParameter(t.MAX_VERTEX_ATTRIBS),M=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),T=t.getParameter(t.MAX_VARYING_VECTORS),x=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),b=S>0,A=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:f,logarithmicDepthBuffer:p,reverseDepthBuffer:l,maxTextures:d,maxVertexTextures:S,maxTextureSize:E,maxCubemapSize:h,maxAttributes:u,maxVertexUniforms:M,maxVaryings:T,maxFragmentUniforms:x,vertexTextures:b,maxSamples:A}}function Cf(t){const n=this;let e=null,i=0,r=!1,s=!1;const a=new Br,o=new Ve,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(p,l){const d=p.length!==0||l||i!==0||r;return r=l,i=p.length,d},this.beginShadows=function(){s=!0,m(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(p,l){e=m(p,l,0)},this.setState=function(p,l,d){const S=p.clippingPlanes,E=p.clipIntersection,h=p.clipShadows,u=t.get(p);if(!r||S===null||S.length===0||s&&!h)s?m(null):f();else{const M=s?0:i,T=M*4;let x=u.clippingState||null;c.value=x,x=m(S,l,T,d);for(let b=0;b!==T;++b)x[b]=e[b];u.clippingState=x,this.numIntersection=E?this.numPlanes:0,this.numPlanes+=M}};function f(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),n.numPlanes=i,n.numIntersection=0}function m(p,l,d,S){const E=p!==null?p.length:0;let h=null;if(E!==0){if(h=c.value,S!==!0||h===null){const u=d+E*4,M=l.matrixWorldInverse;o.getNormalMatrix(M),(h===null||h.length<u)&&(h=new Float32Array(u));for(let T=0,x=d;T!==E;++T,x+=4)a.copy(p[T]).applyMatrix4(M,o),a.normal.toArray(h,x),h[x+3]=a.constant}c.value=h,c.needsUpdate=!0}return n.numPlanes=E,n.numIntersection=0,h}}function Pf(t){let n=new WeakMap;function e(a,o){return o===Ni?a.mapping=ri:o===Tr&&(a.mapping=Dn),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ni||o===Tr)if(n.has(a)){const c=n.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const f=new oc(c.height);return f.fromEquirectangularTexture(t,a),n.set(a,f),a.addEventListener("dispose",r),e(f.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=n.get(o);c!==void 0&&(n.delete(o),c.dispose())}function s(){n=new WeakMap}return{get:i,dispose:s}}const Ln=4,Ds=[.125,.215,.35,.446,.526,.582],fn=20,ji=new Na,Ns=new Pe;let Ji=null,er=0,tr=0,nr=!1;const un=(1+Math.sqrt(5))/2,vn=1/un,Fs=[new z(-un,vn,0),new z(un,vn,0),new z(-vn,0,un),new z(vn,0,un),new z(0,un,-vn),new z(0,un,vn),new z(-1,1,-1),new z(1,1,-1),new z(-1,1,1),new z(1,1,1)],Uf=new z;class Os{constructor(n){this._renderer=n,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(n,e=0,i=.1,r=100,s={}){const{size:a=256,position:o=Uf}=s;Ji=this._renderer.getRenderTarget(),er=this._renderer.getActiveCubeFace(),tr=this._renderer.getActiveMipmapLevel(),nr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(n,i,r,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(n,e=null){return this._fromTexture(n,e)}fromCubemap(n,e=null){return this._fromTexture(n,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gs(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ks(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(n){this._lodMax=Math.floor(Math.log2(n)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let n=0;n<this._lodPlanes.length;n++)this._lodPlanes[n].dispose()}_cleanup(n){this._renderer.setRenderTarget(Ji,er,tr),this._renderer.xr.enabled=nr,n.scissorTest=!1,ui(n,0,0,n.width,n.height)}_fromTexture(n,e){n.mapping===ri||n.mapping===Dn?this._setSize(n.image.length===0?16:n.image[0].width||n.image[0].image.width):this._setSize(n.image.width/4),Ji=this._renderer.getRenderTarget(),er=this._renderer.getActiveCubeFace(),tr=this._renderer.getActiveMipmapLevel(),nr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(n,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const n=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Pn,minFilter:Pn,generateMipmaps:!1,type:Oi,format:bt,colorSpace:Bi,depthBuffer:!1},r=Bs(n,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==n||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bs(n,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Lf(s)),this._blurMaterial=If(s,n,e)}return r}_compileMaterial(n){const e=new wt(this._lodPlanes[0],n);this._renderer.compile(e,ji)}_sceneToCubeUV(n,e,i,r,s){const c=new jn(90,1,e,i),f=[1,-1,1,1,1,1],m=[1,1,1,-1,-1,-1],p=this._renderer,l=p.autoClear,d=p.toneMapping;p.getClearColor(Ns),p.toneMapping=nn,p.autoClear=!1;const S=new Fa({name:"PMREM.Background",side:xt,depthWrite:!1,depthTest:!1}),E=new wt(new La,S);let h=!1;const u=n.background;u?u.isColor&&(S.color.copy(u),n.background=null,h=!0):(S.color.copy(Ns),h=!0);for(let M=0;M<6;M++){const T=M%3;T===0?(c.up.set(0,f[M],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+m[M],s.y,s.z)):T===1?(c.up.set(0,0,f[M]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+m[M],s.z)):(c.up.set(0,f[M],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+m[M]));const x=this._cubeSize;ui(r,T*x,M>2?x:0,x,x),p.setRenderTarget(r),h&&p.render(E,c),p.render(n,c)}E.geometry.dispose(),E.material.dispose(),p.toneMapping=d,p.autoClear=l,n.background=u}_textureToCubeUV(n,e){const i=this._renderer,r=n.mapping===ri||n.mapping===Dn;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gs()),this._cubemapMaterial.uniforms.flipEnvMap.value=n.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ks());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new wt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=n;const c=this._cubeSize;ui(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,ji)}_applyPMREM(n){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Fs[(r-s-1)%Fs.length];this._blur(n,s-1,s,a,o)}e.autoClear=i}_blur(n,e,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(n,a,e,i,r,"latitudinal",s),this._halfBlur(a,n,i,i,r,"longitudinal",s)}_halfBlur(n,e,i,r,s,a,o){const c=this._renderer,f=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const m=3,p=new wt(this._lodPlanes[r],f),l=f.uniforms,d=this._sizeLods[i]-1,S=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*fn-1),E=s/S,h=isFinite(s)?1+Math.floor(m*E):fn;h>fn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${h} samples when the maximum is set to ${fn}`);const u=[];let M=0;for(let w=0;w<fn;++w){const R=w/E,_=Math.exp(-R*R/2);u.push(_),w===0?M+=_:w<h&&(M+=2*_)}for(let w=0;w<u.length;w++)u[w]=u[w]/M;l.envMap.value=n.texture,l.samples.value=h,l.weights.value=u,l.latitudinal.value=a==="latitudinal",o&&(l.poleAxis.value=o);const{_lodMax:T}=this;l.dTheta.value=S,l.mipInt.value=T-i;const x=this._sizeLods[r],b=3*x*(r>T-Ln?r-T+Ln:0),A=4*(this._cubeSize-x);ui(e,b,A,3*x,2*x),c.setRenderTarget(e),c.render(p,ji)}}function Lf(t){const n=[],e=[],i=[];let r=t;const s=t-Ln+1+Ds.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>t-Ln?c=Ds[a-t+Ln-1]:a===0&&(c=0),i.push(c);const f=1/(o-2),m=-f,p=1+f,l=[m,m,p,m,p,p,m,m,p,p,m,p],d=6,S=6,E=3,h=2,u=1,M=new Float32Array(E*S*d),T=new Float32Array(h*S*d),x=new Float32Array(u*S*d);for(let A=0;A<d;A++){const w=A%3*2/3-1,R=A>2?0:-1,_=[w,R,0,w+2/3,R,0,w+2/3,R+1,0,w,R,0,w+2/3,R+1,0,w,R+1,0];M.set(_,E*S*A),T.set(l,h*S*A);const g=[A,A,A,A,A,A];x.set(g,u*S*A)}const b=new gn;b.setAttribute("position",new _t(M,E)),b.setAttribute("uv",new _t(T,h)),b.setAttribute("faceIndex",new _t(x,u)),n.push(b),r>Ln&&r--}return{lodPlanes:n,sizeLods:e,sigmas:i}}function Bs(t,n,e){const i=new kt(t,n,e);return i.texture.mapping=ki,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ui(t,n,e,i,r){t.viewport.set(n,e,i,r),t.scissor.set(n,e,i,r)}function If(t,n,e){const i=new Float32Array(fn),r=new z(0,1,0);return new Ct({name:"SphericalGaussianBlur",defines:{n:fn,CUBEUV_TEXEL_WIDTH:1/n,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:kr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function ks(){return new Ct({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:kr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function Gs(){return new Ct({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:kr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function kr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Df(t){let n=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const c=o.mapping,f=c===Ni||c===Tr,m=c===ri||c===Dn;if(f||m){let p=n.get(o);const l=p!==void 0?p.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==l)return e===null&&(e=new Os(t)),p=f?e.fromEquirectangular(o,p):e.fromCubemap(o,p),p.texture.pmremVersion=o.pmremVersion,n.set(o,p),p.texture;if(p!==void 0)return p.texture;{const d=o.image;return f&&d&&d.height>0||m&&d&&r(d)?(e===null&&(e=new Os(t)),p=f?e.fromEquirectangular(o):e.fromCubemap(o),p.texture.pmremVersion=o.pmremVersion,n.set(o,p),o.addEventListener("dispose",s),p.texture):null}}}return o}function r(o){let c=0;const f=6;for(let m=0;m<f;m++)o[m]!==void 0&&c++;return c===f}function s(o){const c=o.target;c.removeEventListener("dispose",s);const f=n.get(c);f!==void 0&&(n.delete(c),f.dispose())}function a(){n=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function Nf(t){const n={};function e(i){if(n[i]!==void 0)return n[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return n[i]=r,r}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const r=e(i);return r===null&&wi("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Ff(t,n,e,i){const r={},s=new WeakMap;function a(p){const l=p.target;l.index!==null&&n.remove(l.index);for(const S in l.attributes)n.remove(l.attributes[S]);l.removeEventListener("dispose",a),delete r[l.id];const d=s.get(l);d&&(n.remove(d),s.delete(l)),i.releaseStatesOfGeometry(l),l.isInstancedBufferGeometry===!0&&delete l._maxInstanceCount,e.memory.geometries--}function o(p,l){return r[l.id]===!0||(l.addEventListener("dispose",a),r[l.id]=!0,e.memory.geometries++),l}function c(p){const l=p.attributes;for(const d in l)n.update(l[d],t.ARRAY_BUFFER)}function f(p){const l=[],d=p.index,S=p.attributes.position;let E=0;if(d!==null){const M=d.array;E=d.version;for(let T=0,x=M.length;T<x;T+=3){const b=M[T+0],A=M[T+1],w=M[T+2];l.push(b,A,A,w,w,b)}}else if(S!==void 0){const M=S.array;E=S.version;for(let T=0,x=M.length/3-1;T<x;T+=3){const b=T+0,A=T+1,w=T+2;l.push(b,A,A,w,w,b)}}else return;const h=new(pc(l)?fc:dc)(l,1);h.version=E;const u=s.get(p);u&&n.remove(u),s.set(p,h)}function m(p){const l=s.get(p);if(l){const d=p.index;d!==null&&l.version<d.version&&f(p)}else f(p);return s.get(p)}return{get:o,update:c,getWireframeAttribute:m}}function Of(t,n,e){let i;function r(l){i=l}let s,a;function o(l){s=l.type,a=l.bytesPerElement}function c(l,d){t.drawElements(i,d,s,l*a),e.update(d,i,1)}function f(l,d,S){S!==0&&(t.drawElementsInstanced(i,d,s,l*a,S),e.update(d,i,S))}function m(l,d,S){if(S===0)return;n.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,l,0,S);let h=0;for(let u=0;u<S;u++)h+=d[u];e.update(h,i,1)}function p(l,d,S,E){if(S===0)return;const h=n.get("WEBGL_multi_draw");if(h===null)for(let u=0;u<l.length;u++)f(l[u]/a,d[u],E[u]);else{h.multiDrawElementsInstancedWEBGL(i,d,0,s,l,0,E,0,S);let u=0;for(let M=0;M<S;M++)u+=d[M]*E[M];e.update(u,i,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=f,this.renderMultiDraw=m,this.renderMultiDrawInstances=p}function Bf(t){const n={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(e.calls++,a){case t.TRIANGLES:e.triangles+=o*(s/3);break;case t.LINES:e.lines+=o*(s/2);break;case t.LINE_STRIP:e.lines+=o*(s-1);break;case t.LINE_LOOP:e.lines+=o*s;break;case t.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:n,render:e,programs:null,autoReset:!0,reset:r,update:i}}function kf(t,n,e){const i=new WeakMap,r=new Et;function s(a,o,c){const f=a.morphTargetInfluences,m=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=m!==void 0?m.length:0;let l=i.get(o);if(l===void 0||l.count!==p){let _=function(){w.dispose(),i.delete(o),o.removeEventListener("dispose",_)};l!==void 0&&l.texture.dispose();const d=o.morphAttributes.position!==void 0,S=o.morphAttributes.normal!==void 0,E=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],u=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let T=0;d===!0&&(T=1),S===!0&&(T=2),E===!0&&(T=3);let x=o.attributes.position.count*T,b=1;x>n.maxTextureSize&&(b=Math.ceil(x/n.maxTextureSize),x=n.maxTextureSize);const A=new Float32Array(x*b*4*p),w=new Pa(A,x,b,p);w.type=Gt,w.needsUpdate=!0;const R=T*4;for(let g=0;g<p;g++){const P=h[g],U=u[g],I=M[g],B=x*b*4*g;for(let X=0;X<P.count;X++){const G=X*R;d===!0&&(r.fromBufferAttribute(P,X),A[B+G+0]=r.x,A[B+G+1]=r.y,A[B+G+2]=r.z,A[B+G+3]=0),S===!0&&(r.fromBufferAttribute(U,X),A[B+G+4]=r.x,A[B+G+5]=r.y,A[B+G+6]=r.z,A[B+G+7]=0),E===!0&&(r.fromBufferAttribute(I,X),A[B+G+8]=r.x,A[B+G+9]=r.y,A[B+G+10]=r.z,A[B+G+11]=I.itemSize===4?r.w:1)}}l={count:p,texture:w,size:new lt(x,b)},i.set(o,l),o.addEventListener("dispose",_)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(t,"morphTexture",a.morphTexture,e);else{let d=0;for(let E=0;E<f.length;E++)d+=f[E];const S=o.morphTargetsRelative?1:1-d;c.getUniforms().setValue(t,"morphTargetBaseInfluence",S),c.getUniforms().setValue(t,"morphTargetInfluences",f)}c.getUniforms().setValue(t,"morphTargetsTexture",l.texture,e),c.getUniforms().setValue(t,"morphTargetsTextureSize",l.size)}return{update:s}}function Gf(t,n,e,i){let r=new WeakMap;function s(c){const f=i.render.frame,m=c.geometry,p=n.get(c,m);if(r.get(p)!==f&&(n.update(p),r.set(p,f)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==f&&(e.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,t.ARRAY_BUFFER),r.set(c,f))),c.isSkinnedMesh){const l=c.skeleton;r.get(l)!==f&&(l.update(),r.set(l,f))}return p}function a(){r=new WeakMap}function o(c){const f=c.target;f.removeEventListener("dispose",o),e.remove(f.instanceMatrix),f.instanceColor!==null&&e.remove(f.instanceColor)}return{update:s,dispose:a}}const za=new ya,Vs=new Ma(1,1),Wa=new Pa,Xa=new Ac,qa=new xc,Hs=[],zs=[],Ws=new Float32Array(16),Xs=new Float32Array(9),qs=new Float32Array(4);function Nn(t,n,e){const i=t[0];if(i<=0||i>0)return t;const r=n*e;let s=Hs[r];if(s===void 0&&(s=new Float32Array(r),Hs[r]=s),n!==0){i.toArray(s,0);for(let a=1,o=0;a!==n;++a)o+=e,t[a].toArray(s,o)}return s}function pt(t,n){if(t.length!==n.length)return!1;for(let e=0,i=t.length;e<i;e++)if(t[e]!==n[e])return!1;return!0}function ht(t,n){for(let e=0,i=n.length;e<i;e++)t[e]=n[e]}function Gi(t,n){let e=zs[n];e===void 0&&(e=new Int32Array(n),zs[n]=e);for(let i=0;i!==n;++i)e[i]=t.allocateTextureUnit();return e}function Vf(t,n){const e=this.cache;e[0]!==n&&(t.uniform1f(this.addr,n),e[0]=n)}function Hf(t,n){const e=this.cache;if(n.x!==void 0)(e[0]!==n.x||e[1]!==n.y)&&(t.uniform2f(this.addr,n.x,n.y),e[0]=n.x,e[1]=n.y);else{if(pt(e,n))return;t.uniform2fv(this.addr,n),ht(e,n)}}function zf(t,n){const e=this.cache;if(n.x!==void 0)(e[0]!==n.x||e[1]!==n.y||e[2]!==n.z)&&(t.uniform3f(this.addr,n.x,n.y,n.z),e[0]=n.x,e[1]=n.y,e[2]=n.z);else if(n.r!==void 0)(e[0]!==n.r||e[1]!==n.g||e[2]!==n.b)&&(t.uniform3f(this.addr,n.r,n.g,n.b),e[0]=n.r,e[1]=n.g,e[2]=n.b);else{if(pt(e,n))return;t.uniform3fv(this.addr,n),ht(e,n)}}function Wf(t,n){const e=this.cache;if(n.x!==void 0)(e[0]!==n.x||e[1]!==n.y||e[2]!==n.z||e[3]!==n.w)&&(t.uniform4f(this.addr,n.x,n.y,n.z,n.w),e[0]=n.x,e[1]=n.y,e[2]=n.z,e[3]=n.w);else{if(pt(e,n))return;t.uniform4fv(this.addr,n),ht(e,n)}}function Xf(t,n){const e=this.cache,i=n.elements;if(i===void 0){if(pt(e,n))return;t.uniformMatrix2fv(this.addr,!1,n),ht(e,n)}else{if(pt(e,i))return;qs.set(i),t.uniformMatrix2fv(this.addr,!1,qs),ht(e,i)}}function qf(t,n){const e=this.cache,i=n.elements;if(i===void 0){if(pt(e,n))return;t.uniformMatrix3fv(this.addr,!1,n),ht(e,n)}else{if(pt(e,i))return;Xs.set(i),t.uniformMatrix3fv(this.addr,!1,Xs),ht(e,i)}}function Yf(t,n){const e=this.cache,i=n.elements;if(i===void 0){if(pt(e,n))return;t.uniformMatrix4fv(this.addr,!1,n),ht(e,n)}else{if(pt(e,i))return;Ws.set(i),t.uniformMatrix4fv(this.addr,!1,Ws),ht(e,i)}}function Kf(t,n){const e=this.cache;e[0]!==n&&(t.uniform1i(this.addr,n),e[0]=n)}function $f(t,n){const e=this.cache;if(n.x!==void 0)(e[0]!==n.x||e[1]!==n.y)&&(t.uniform2i(this.addr,n.x,n.y),e[0]=n.x,e[1]=n.y);else{if(pt(e,n))return;t.uniform2iv(this.addr,n),ht(e,n)}}function Qf(t,n){const e=this.cache;if(n.x!==void 0)(e[0]!==n.x||e[1]!==n.y||e[2]!==n.z)&&(t.uniform3i(this.addr,n.x,n.y,n.z),e[0]=n.x,e[1]=n.y,e[2]=n.z);else{if(pt(e,n))return;t.uniform3iv(this.addr,n),ht(e,n)}}function Zf(t,n){const e=this.cache;if(n.x!==void 0)(e[0]!==n.x||e[1]!==n.y||e[2]!==n.z||e[3]!==n.w)&&(t.uniform4i(this.addr,n.x,n.y,n.z,n.w),e[0]=n.x,e[1]=n.y,e[2]=n.z,e[3]=n.w);else{if(pt(e,n))return;t.uniform4iv(this.addr,n),ht(e,n)}}function jf(t,n){const e=this.cache;e[0]!==n&&(t.uniform1ui(this.addr,n),e[0]=n)}function Jf(t,n){const e=this.cache;if(n.x!==void 0)(e[0]!==n.x||e[1]!==n.y)&&(t.uniform2ui(this.addr,n.x,n.y),e[0]=n.x,e[1]=n.y);else{if(pt(e,n))return;t.uniform2uiv(this.addr,n),ht(e,n)}}function ed(t,n){const e=this.cache;if(n.x!==void 0)(e[0]!==n.x||e[1]!==n.y||e[2]!==n.z)&&(t.uniform3ui(this.addr,n.x,n.y,n.z),e[0]=n.x,e[1]=n.y,e[2]=n.z);else{if(pt(e,n))return;t.uniform3uiv(this.addr,n),ht(e,n)}}function td(t,n){const e=this.cache;if(n.x!==void 0)(e[0]!==n.x||e[1]!==n.y||e[2]!==n.z||e[3]!==n.w)&&(t.uniform4ui(this.addr,n.x,n.y,n.z,n.w),e[0]=n.x,e[1]=n.y,e[2]=n.z,e[3]=n.w);else{if(pt(e,n))return;t.uniform4uiv(this.addr,n),ht(e,n)}}function nd(t,n,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Vs.compareFunction=Ea,s=Vs):s=za,e.setTexture2D(n||s,r)}function id(t,n,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),e.setTexture3D(n||Xa,r)}function rd(t,n,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),e.setTextureCube(n||qa,r)}function sd(t,n,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),e.setTexture2DArray(n||Wa,r)}function ad(t){switch(t){case 5126:return Vf;case 35664:return Hf;case 35665:return zf;case 35666:return Wf;case 35674:return Xf;case 35675:return qf;case 35676:return Yf;case 5124:case 35670:return Kf;case 35667:case 35671:return $f;case 35668:case 35672:return Qf;case 35669:case 35673:return Zf;case 5125:return jf;case 36294:return Jf;case 36295:return ed;case 36296:return td;case 35678:case 36198:case 36298:case 36306:case 35682:return nd;case 35679:case 36299:case 36307:return id;case 35680:case 36300:case 36308:case 36293:return rd;case 36289:case 36303:case 36311:case 36292:return sd}}function od(t,n){t.uniform1fv(this.addr,n)}function cd(t,n){const e=Nn(n,this.size,2);t.uniform2fv(this.addr,e)}function ld(t,n){const e=Nn(n,this.size,3);t.uniform3fv(this.addr,e)}function ud(t,n){const e=Nn(n,this.size,4);t.uniform4fv(this.addr,e)}function fd(t,n){const e=Nn(n,this.size,4);t.uniformMatrix2fv(this.addr,!1,e)}function dd(t,n){const e=Nn(n,this.size,9);t.uniformMatrix3fv(this.addr,!1,e)}function pd(t,n){const e=Nn(n,this.size,16);t.uniformMatrix4fv(this.addr,!1,e)}function hd(t,n){t.uniform1iv(this.addr,n)}function md(t,n){t.uniform2iv(this.addr,n)}function gd(t,n){t.uniform3iv(this.addr,n)}function _d(t,n){t.uniform4iv(this.addr,n)}function vd(t,n){t.uniform1uiv(this.addr,n)}function Sd(t,n){t.uniform2uiv(this.addr,n)}function Md(t,n){t.uniform3uiv(this.addr,n)}function Ed(t,n){t.uniform4uiv(this.addr,n)}function Td(t,n,e){const i=this.cache,r=n.length,s=Gi(e,r);pt(i,s)||(t.uniform1iv(this.addr,s),ht(i,s));for(let a=0;a!==r;++a)e.setTexture2D(n[a]||za,s[a])}function xd(t,n,e){const i=this.cache,r=n.length,s=Gi(e,r);pt(i,s)||(t.uniform1iv(this.addr,s),ht(i,s));for(let a=0;a!==r;++a)e.setTexture3D(n[a]||Xa,s[a])}function Ad(t,n,e){const i=this.cache,r=n.length,s=Gi(e,r);pt(i,s)||(t.uniform1iv(this.addr,s),ht(i,s));for(let a=0;a!==r;++a)e.setTextureCube(n[a]||qa,s[a])}function yd(t,n,e){const i=this.cache,r=n.length,s=Gi(e,r);pt(i,s)||(t.uniform1iv(this.addr,s),ht(i,s));for(let a=0;a!==r;++a)e.setTexture2DArray(n[a]||Wa,s[a])}function bd(t){switch(t){case 5126:return od;case 35664:return cd;case 35665:return ld;case 35666:return ud;case 35674:return fd;case 35675:return dd;case 35676:return pd;case 5124:case 35670:return hd;case 35667:case 35671:return md;case 35668:case 35672:return gd;case 35669:case 35673:return _d;case 5125:return vd;case 36294:return Sd;case 36295:return Md;case 36296:return Ed;case 35678:case 36198:case 36298:case 36306:case 35682:return Td;case 35679:case 36299:case 36307:return xd;case 35680:case 36300:case 36308:case 36293:return Ad;case 36289:case 36303:case 36311:case 36292:return yd}}class wd{constructor(n,e,i){this.id=n,this.addr=i,this.cache=[],this.type=e.type,this.setValue=ad(e.type)}}class Rd{constructor(n,e,i){this.id=n,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=bd(e.type)}}class Cd{constructor(n){this.id=n,this.seq=[],this.map={}}setValue(n,e,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(n,e[o.id],i)}}}const ir=/(\w+)(\])?(\[|\.)?/g;function Ys(t,n){t.seq.push(n),t.map[n.id]=n}function Pd(t,n,e){const i=t.name,r=i.length;for(ir.lastIndex=0;;){const s=ir.exec(i),a=ir.lastIndex;let o=s[1];const c=s[2]==="]",f=s[3];if(c&&(o=o|0),f===void 0||f==="["&&a+2===r){Ys(e,f===void 0?new wd(o,t,n):new Rd(o,t,n));break}else{let p=e.map[o];p===void 0&&(p=new Cd(o),Ys(e,p)),e=p}}}class Ci{constructor(n,e){this.seq=[],this.map={};const i=n.getProgramParameter(e,n.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=n.getActiveUniform(e,r),a=n.getUniformLocation(e,s.name);Pd(s,a,this)}}setValue(n,e,i,r){const s=this.map[e];s!==void 0&&s.setValue(n,i,r)}setOptional(n,e,i){const r=e[i];r!==void 0&&this.setValue(n,i,r)}static upload(n,e,i,r){for(let s=0,a=e.length;s!==a;++s){const o=e[s],c=i[o.id];c.needsUpdate!==!1&&o.setValue(n,c.value,r)}}static seqWithValue(n,e){const i=[];for(let r=0,s=n.length;r!==s;++r){const a=n[r];a.id in e&&i.push(a)}return i}}function Ks(t,n,e){const i=t.createShader(n);return t.shaderSource(i,e),t.compileShader(i),i}const Ud=37297;let Ld=0;function Id(t,n){const e=t.split(`
`),i=[],r=Math.max(n-6,0),s=Math.min(n+6,e.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===n?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const $s=new Ve;function Dd(t){ot._getMatrix($s,ot.workingColorSpace,t);const n=`mat3( ${$s.elements.map(e=>e.toFixed(4))} )`;switch(ot.getTransfer(t)){case Da:return[n,"LinearTransferOETF"];case je:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[n,"LinearTransferOETF"]}}function Qs(t,n,e){const i=t.getShaderParameter(n,t.COMPILE_STATUS),r=t.getShaderInfoLog(n).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return e.toUpperCase()+`

`+r+`

`+Id(t.getShaderSource(n),a)}else return r}function Nd(t,n){const e=Dd(n);return[`vec4 ${t}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Fd(t,n){let e;switch(n){case Tc:e="Linear";break;case Ec:e="Reinhard";break;case Mc:e="Cineon";break;case Sc:e="ACESFilmic";break;case vc:e="AgX";break;case _c:e="Neutral";break;case gc:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",n),e="Linear"}return"vec3 "+t+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const fi=new z;function Od(){ot.getLuminanceCoefficients(fi);const t=fi.x.toFixed(4),n=fi.y.toFixed(4),e=fi.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${n}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Bd(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qn).join(`
`)}function kd(t){const n=[];for(const e in t){const i=t[e];i!==!1&&n.push("#define "+e+" "+i)}return n.join(`
`)}function Gd(t,n){const e={},i=t.getProgramParameter(n,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(n,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:t.getAttribLocation(n,a),locationSize:o}}return e}function Qn(t){return t!==""}function Zs(t,n){const e=n.numSpotLightShadows+n.numSpotLightMaps-n.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,n.numDirLights).replace(/NUM_SPOT_LIGHTS/g,n.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,n.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,n.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,n.numPointLights).replace(/NUM_HEMI_LIGHTS/g,n.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,n.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,n.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,n.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,n.numPointLightShadows)}function js(t,n){return t.replace(/NUM_CLIPPING_PLANES/g,n.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,n.numClippingPlanes-n.numClipIntersection)}const Vd=/^[ \t]*#include +<([\w\d./]+)>/gm;function yr(t){return t.replace(Vd,zd)}const Hd=new Map;function zd(t,n){let e=Fe[n];if(e===void 0){const i=Hd.get(n);if(i!==void 0)e=Fe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',n,i);else throw new Error("Can not resolve #include <"+n+">")}return yr(e)}const Wd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Js(t){return t.replace(Wd,Xd)}function Xd(t,n,e,i){let r="";for(let s=parseInt(n);s<parseInt(e);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function ea(t){let n=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?n+=`
#define HIGH_PRECISION`:t.precision==="mediump"?n+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(n+=`
#define LOW_PRECISION`),n}function qd(t){let n="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===Ta?n="SHADOWMAP_TYPE_PCF":t.shadowMapType===mc?n="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===Xt&&(n="SHADOWMAP_TYPE_VSM"),n}function Yd(t){let n="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case ri:case Dn:n="ENVMAP_TYPE_CUBE";break;case ki:n="ENVMAP_TYPE_CUBE_UV";break}return n}function Kd(t){let n="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Dn:n="ENVMAP_MODE_REFRACTION";break}return n}function $d(t){let n="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case Rc:n="ENVMAP_BLENDING_MULTIPLY";break;case wc:n="ENVMAP_BLENDING_MIX";break;case bc:n="ENVMAP_BLENDING_ADD";break}return n}function Qd(t){const n=t.envMapCubeUVHeight;if(n===null)return null;const e=Math.log2(n)-2,i=1/n;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function Zd(t,n,e,i){const r=t.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=qd(e),f=Yd(e),m=Kd(e),p=$d(e),l=Qd(e),d=Bd(e),S=kd(s),E=r.createProgram();let h,u,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(h=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,S].filter(Qn).join(`
`),h.length>0&&(h+=`
`),u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,S].filter(Qn).join(`
`),u.length>0&&(u+=`
`)):(h=[ea(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,S,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+m:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qn).join(`
`),u=[ea(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,S,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+f:"",e.envMap?"#define "+m:"",e.envMap?"#define "+p:"",l?"#define CUBEUV_TEXEL_WIDTH "+l.texelWidth:"",l?"#define CUBEUV_TEXEL_HEIGHT "+l.texelHeight:"",l?"#define CUBEUV_MAX_MIP "+l.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==nn?"#define TONE_MAPPING":"",e.toneMapping!==nn?Fe.tonemapping_pars_fragment:"",e.toneMapping!==nn?Fd("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Fe.colorspace_pars_fragment,Nd("linearToOutputTexel",e.outputColorSpace),Od(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Qn).join(`
`)),a=yr(a),a=Zs(a,e),a=js(a,e),o=yr(o),o=Zs(o,e),o=js(o,e),a=Js(a),o=Js(o),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,h=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+h,u=["#define varying in",e.glslVersion===Cs?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Cs?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const T=M+h+a,x=M+u+o,b=Ks(r,r.VERTEX_SHADER,T),A=Ks(r,r.FRAGMENT_SHADER,x);r.attachShader(E,b),r.attachShader(E,A),e.index0AttributeName!==void 0?r.bindAttribLocation(E,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(E,0,"position"),r.linkProgram(E);function w(P){if(t.debug.checkShaderErrors){const U=r.getProgramInfoLog(E).trim(),I=r.getShaderInfoLog(b).trim(),B=r.getShaderInfoLog(A).trim();let X=!0,G=!0;if(r.getProgramParameter(E,r.LINK_STATUS)===!1)if(X=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,E,b,A);else{const ee=Qs(r,b,"vertex"),W=Qs(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(E,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+U+`
`+ee+`
`+W)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(I===""||B==="")&&(G=!1);G&&(P.diagnostics={runnable:X,programLog:U,vertexShader:{log:I,prefix:h},fragmentShader:{log:B,prefix:u}})}r.deleteShader(b),r.deleteShader(A),R=new Ci(r,E),_=Gd(r,E)}let R;this.getUniforms=function(){return R===void 0&&w(this),R};let _;this.getAttributes=function(){return _===void 0&&w(this),_};let g=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return g===!1&&(g=r.getProgramParameter(E,Ud)),g},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(E),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ld++,this.cacheKey=n,this.usedTimes=1,this.program=E,this.vertexShader=b,this.fragmentShader=A,this}let jd=0;class Jd{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(n){const e=n.vertexShader,i=n.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(n);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(n){const e=this.materialCache.get(n);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(n),this}getVertexShaderID(n){return this._getShaderStage(n.vertexShader).id}getFragmentShaderID(n){return this._getShaderStage(n.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(n){const e=this.materialCache;let i=e.get(n);return i===void 0&&(i=new Set,e.set(n,i)),i}_getShaderStage(n){const e=this.shaderCache;let i=e.get(n);return i===void 0&&(i=new ep(n),e.set(n,i)),i}}class ep{constructor(n){this.id=jd++,this.code=n,this.usedTimes=0}}function tp(t,n,e,i,r,s,a){const o=new hc,c=new Jd,f=new Set,m=[],p=r.logarithmicDepthBuffer,l=r.vertexTextures;let d=r.precision;const S={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function E(_){return f.add(_),_===0?"uv":`uv${_}`}function h(_,g,P,U,I){const B=U.fog,X=I.geometry,G=_.isMeshStandardMaterial?U.environment:null,ee=(_.isMeshStandardMaterial?e:n).get(_.envMap||G),W=ee&&ee.mapping===ki?ee.image.height:null,fe=S[_.type];_.precision!==null&&(d=r.getMaxPrecision(_.precision),d!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));const ye=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Re=ye!==void 0?ye.length:0;let Oe=0;X.morphAttributes.position!==void 0&&(Oe=1),X.morphAttributes.normal!==void 0&&(Oe=2),X.morphAttributes.color!==void 0&&(Oe=3);let qe,K,ne,Se;if(fe){const Xe=Ht[fe];qe=Xe.vertexShader,K=Xe.fragmentShader}else qe=_.vertexShader,K=_.fragmentShader,c.update(_),ne=c.getVertexShaderID(_),Se=c.getFragmentShaderID(_);const ce=t.getRenderTarget(),Me=t.state.buffers.depth.getReversed(),He=I.isInstancedMesh===!0,Ce=I.isBatchedMesh===!0,tt=!!_.map,nt=!!_.matcap,ze=!!ee,L=!!_.aoMap,mt=!!_.lightMap,We=!!_.bumpMap,$e=!!_.normalMap,ge=!!_.displacementMap,ke=!!_.emissiveMap,xe=!!_.metalnessMap,Ne=!!_.roughnessMap,ut=_.anisotropy>0,C=_.clearcoat>0,v=_.dispersion>0,k=_.iridescence>0,Y=_.sheen>0,Q=_.transmission>0,q=ut&&!!_.anisotropyMap,_e=C&&!!_.clearcoatMap,se=C&&!!_.clearcoatNormalMap,me=C&&!!_.clearcoatRoughnessMap,ve=k&&!!_.iridescenceMap,Z=k&&!!_.iridescenceThicknessMap,le=Y&&!!_.sheenColorMap,we=Y&&!!_.sheenRoughnessMap,be=!!_.specularMap,ie=!!_.specularColorMap,Ie=!!_.specularIntensityMap,D=Q&&!!_.transmissionMap,ae=Q&&!!_.thicknessMap,j=!!_.gradientMap,de=!!_.alphaMap,J=_.alphaTest>0,$=!!_.alphaHash,pe=!!_.extensions;let De=nn;_.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(De=t.toneMapping);const Qe={shaderID:fe,shaderType:_.type,shaderName:_.name,vertexShader:qe,fragmentShader:K,defines:_.defines,customVertexShaderID:ne,customFragmentShaderID:Se,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:Ce,batchingColor:Ce&&I._colorsTexture!==null,instancing:He,instancingColor:He&&I.instanceColor!==null,instancingMorph:He&&I.morphTexture!==null,supportsVertexTextures:l,outputColorSpace:ce===null?t.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:Bi,alphaToCoverage:!!_.alphaToCoverage,map:tt,matcap:nt,envMap:ze,envMapMode:ze&&ee.mapping,envMapCubeUVHeight:W,aoMap:L,lightMap:mt,bumpMap:We,normalMap:$e,displacementMap:l&&ge,emissiveMap:ke,normalMapObjectSpace:$e&&_.normalMapType===uc,normalMapTangentSpace:$e&&_.normalMapType===lc,metalnessMap:xe,roughnessMap:Ne,anisotropy:ut,anisotropyMap:q,clearcoat:C,clearcoatMap:_e,clearcoatNormalMap:se,clearcoatRoughnessMap:me,dispersion:v,iridescence:k,iridescenceMap:ve,iridescenceThicknessMap:Z,sheen:Y,sheenColorMap:le,sheenRoughnessMap:we,specularMap:be,specularColorMap:ie,specularIntensityMap:Ie,transmission:Q,transmissionMap:D,thicknessMap:ae,gradientMap:j,opaque:_.transparent===!1&&_.blending===Ri&&_.alphaToCoverage===!1,alphaMap:de,alphaTest:J,alphaHash:$,combine:_.combine,mapUv:tt&&E(_.map.channel),aoMapUv:L&&E(_.aoMap.channel),lightMapUv:mt&&E(_.lightMap.channel),bumpMapUv:We&&E(_.bumpMap.channel),normalMapUv:$e&&E(_.normalMap.channel),displacementMapUv:ge&&E(_.displacementMap.channel),emissiveMapUv:ke&&E(_.emissiveMap.channel),metalnessMapUv:xe&&E(_.metalnessMap.channel),roughnessMapUv:Ne&&E(_.roughnessMap.channel),anisotropyMapUv:q&&E(_.anisotropyMap.channel),clearcoatMapUv:_e&&E(_.clearcoatMap.channel),clearcoatNormalMapUv:se&&E(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:me&&E(_.clearcoatRoughnessMap.channel),iridescenceMapUv:ve&&E(_.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&E(_.iridescenceThicknessMap.channel),sheenColorMapUv:le&&E(_.sheenColorMap.channel),sheenRoughnessMapUv:we&&E(_.sheenRoughnessMap.channel),specularMapUv:be&&E(_.specularMap.channel),specularColorMapUv:ie&&E(_.specularColorMap.channel),specularIntensityMapUv:Ie&&E(_.specularIntensityMap.channel),transmissionMapUv:D&&E(_.transmissionMap.channel),thicknessMapUv:ae&&E(_.thicknessMap.channel),alphaMapUv:de&&E(_.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&($e||ut),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!X.attributes.uv&&(tt||de),fog:!!B,useFog:_.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:_.flatShading===!0&&_.wireframe===!1,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:p,reverseDepthBuffer:Me,skinning:I.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:Re,morphTextureStride:Oe,numDirLights:g.directional.length,numPointLights:g.point.length,numSpotLights:g.spot.length,numSpotLightMaps:g.spotLightMap.length,numRectAreaLights:g.rectArea.length,numHemiLights:g.hemi.length,numDirLightShadows:g.directionalShadowMap.length,numPointLightShadows:g.pointShadowMap.length,numSpotLightShadows:g.spotShadowMap.length,numSpotLightShadowsWithMaps:g.numSpotLightShadowsWithMaps,numLightProbes:g.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:_.dithering,shadowMapEnabled:t.shadowMap.enabled&&P.length>0,shadowMapType:t.shadowMap.type,toneMapping:De,decodeVideoTexture:tt&&_.map.isVideoTexture===!0&&ot.getTransfer(_.map.colorSpace)===je,decodeVideoTextureEmissive:ke&&_.emissiveMap.isVideoTexture===!0&&ot.getTransfer(_.emissiveMap.colorSpace)===je,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Lt,flipSided:_.side===xt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:pe&&_.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pe&&_.extensions.multiDraw===!0||Ce)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Qe.vertexUv1s=f.has(1),Qe.vertexUv2s=f.has(2),Qe.vertexUv3s=f.has(3),f.clear(),Qe}function u(_){const g=[];if(_.shaderID?g.push(_.shaderID):(g.push(_.customVertexShaderID),g.push(_.customFragmentShaderID)),_.defines!==void 0)for(const P in _.defines)g.push(P),g.push(_.defines[P]);return _.isRawShaderMaterial===!1&&(M(g,_),T(g,_),g.push(t.outputColorSpace)),g.push(_.customProgramCacheKey),g.join()}function M(_,g){_.push(g.precision),_.push(g.outputColorSpace),_.push(g.envMapMode),_.push(g.envMapCubeUVHeight),_.push(g.mapUv),_.push(g.alphaMapUv),_.push(g.lightMapUv),_.push(g.aoMapUv),_.push(g.bumpMapUv),_.push(g.normalMapUv),_.push(g.displacementMapUv),_.push(g.emissiveMapUv),_.push(g.metalnessMapUv),_.push(g.roughnessMapUv),_.push(g.anisotropyMapUv),_.push(g.clearcoatMapUv),_.push(g.clearcoatNormalMapUv),_.push(g.clearcoatRoughnessMapUv),_.push(g.iridescenceMapUv),_.push(g.iridescenceThicknessMapUv),_.push(g.sheenColorMapUv),_.push(g.sheenRoughnessMapUv),_.push(g.specularMapUv),_.push(g.specularColorMapUv),_.push(g.specularIntensityMapUv),_.push(g.transmissionMapUv),_.push(g.thicknessMapUv),_.push(g.combine),_.push(g.fogExp2),_.push(g.sizeAttenuation),_.push(g.morphTargetsCount),_.push(g.morphAttributeCount),_.push(g.numDirLights),_.push(g.numPointLights),_.push(g.numSpotLights),_.push(g.numSpotLightMaps),_.push(g.numHemiLights),_.push(g.numRectAreaLights),_.push(g.numDirLightShadows),_.push(g.numPointLightShadows),_.push(g.numSpotLightShadows),_.push(g.numSpotLightShadowsWithMaps),_.push(g.numLightProbes),_.push(g.shadowMapType),_.push(g.toneMapping),_.push(g.numClippingPlanes),_.push(g.numClipIntersection),_.push(g.depthPacking)}function T(_,g){o.disableAll(),g.supportsVertexTextures&&o.enable(0),g.instancing&&o.enable(1),g.instancingColor&&o.enable(2),g.instancingMorph&&o.enable(3),g.matcap&&o.enable(4),g.envMap&&o.enable(5),g.normalMapObjectSpace&&o.enable(6),g.normalMapTangentSpace&&o.enable(7),g.clearcoat&&o.enable(8),g.iridescence&&o.enable(9),g.alphaTest&&o.enable(10),g.vertexColors&&o.enable(11),g.vertexAlphas&&o.enable(12),g.vertexUv1s&&o.enable(13),g.vertexUv2s&&o.enable(14),g.vertexUv3s&&o.enable(15),g.vertexTangents&&o.enable(16),g.anisotropy&&o.enable(17),g.alphaHash&&o.enable(18),g.batching&&o.enable(19),g.dispersion&&o.enable(20),g.batchingColor&&o.enable(21),g.gradientMap&&o.enable(22),_.push(o.mask),o.disableAll(),g.fog&&o.enable(0),g.useFog&&o.enable(1),g.flatShading&&o.enable(2),g.logarithmicDepthBuffer&&o.enable(3),g.reverseDepthBuffer&&o.enable(4),g.skinning&&o.enable(5),g.morphTargets&&o.enable(6),g.morphNormals&&o.enable(7),g.morphColors&&o.enable(8),g.premultipliedAlpha&&o.enable(9),g.shadowMapEnabled&&o.enable(10),g.doubleSided&&o.enable(11),g.flipSided&&o.enable(12),g.useDepthPacking&&o.enable(13),g.dithering&&o.enable(14),g.transmission&&o.enable(15),g.sheen&&o.enable(16),g.opaque&&o.enable(17),g.pointsUvs&&o.enable(18),g.decodeVideoTexture&&o.enable(19),g.decodeVideoTextureEmissive&&o.enable(20),g.alphaToCoverage&&o.enable(21),_.push(o.mask)}function x(_){const g=S[_.type];let P;if(g){const U=Ht[g];P=cc.clone(U.uniforms)}else P=_.uniforms;return P}function b(_,g){let P;for(let U=0,I=m.length;U<I;U++){const B=m[U];if(B.cacheKey===g){P=B,++P.usedTimes;break}}return P===void 0&&(P=new Zd(t,g,_,s),m.push(P)),P}function A(_){if(--_.usedTimes===0){const g=m.indexOf(_);m[g]=m[m.length-1],m.pop(),_.destroy()}}function w(_){c.remove(_)}function R(){c.dispose()}return{getParameters:h,getProgramCacheKey:u,getUniforms:x,acquireProgram:b,releaseProgram:A,releaseShaderCache:w,programs:m,dispose:R}}function np(){let t=new WeakMap;function n(a){return t.has(a)}function e(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,c){t.get(a)[o]=c}function s(){t=new WeakMap}return{has:n,get:e,remove:i,update:r,dispose:s}}function ip(t,n){return t.groupOrder!==n.groupOrder?t.groupOrder-n.groupOrder:t.renderOrder!==n.renderOrder?t.renderOrder-n.renderOrder:t.material.id!==n.material.id?t.material.id-n.material.id:t.z!==n.z?t.z-n.z:t.id-n.id}function ta(t,n){return t.groupOrder!==n.groupOrder?t.groupOrder-n.groupOrder:t.renderOrder!==n.renderOrder?t.renderOrder-n.renderOrder:t.z!==n.z?n.z-t.z:t.id-n.id}function na(){const t=[];let n=0;const e=[],i=[],r=[];function s(){n=0,e.length=0,i.length=0,r.length=0}function a(p,l,d,S,E,h){let u=t[n];return u===void 0?(u={id:p.id,object:p,geometry:l,material:d,groupOrder:S,renderOrder:p.renderOrder,z:E,group:h},t[n]=u):(u.id=p.id,u.object=p,u.geometry=l,u.material=d,u.groupOrder=S,u.renderOrder=p.renderOrder,u.z=E,u.group=h),n++,u}function o(p,l,d,S,E,h){const u=a(p,l,d,S,E,h);d.transmission>0?i.push(u):d.transparent===!0?r.push(u):e.push(u)}function c(p,l,d,S,E,h){const u=a(p,l,d,S,E,h);d.transmission>0?i.unshift(u):d.transparent===!0?r.unshift(u):e.unshift(u)}function f(p,l){e.length>1&&e.sort(p||ip),i.length>1&&i.sort(l||ta),r.length>1&&r.sort(l||ta)}function m(){for(let p=n,l=t.length;p<l;p++){const d=t[p];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:i,transparent:r,init:s,push:o,unshift:c,finish:m,sort:f}}function rp(){let t=new WeakMap;function n(i,r){const s=t.get(i);let a;return s===void 0?(a=new na,t.set(i,[a])):r>=s.length?(a=new na,s.push(a)):a=s[r],a}function e(){t=new WeakMap}return{get:n,dispose:e}}function sp(){const t={};return{get:function(n){if(t[n.id]!==void 0)return t[n.id];let e;switch(n.type){case"DirectionalLight":e={direction:new z,color:new Pe};break;case"SpotLight":e={position:new z,direction:new z,color:new Pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new z,color:new Pe,distance:0,decay:0};break;case"HemisphereLight":e={direction:new z,skyColor:new Pe,groundColor:new Pe};break;case"RectAreaLight":e={color:new Pe,position:new z,halfWidth:new z,halfHeight:new z};break}return t[n.id]=e,e}}}function ap(){const t={};return{get:function(n){if(t[n.id]!==void 0)return t[n.id];let e;switch(n.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[n.id]=e,e}}}let op=0;function cp(t,n){return(n.castShadow?2:0)-(t.castShadow?2:0)+(n.map?1:0)-(t.map?1:0)}function lp(t){const n=new sp,e=ap(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let f=0;f<9;f++)i.probe.push(new z);const r=new z,s=new ft,a=new ft;function o(f){let m=0,p=0,l=0;for(let _=0;_<9;_++)i.probe[_].set(0,0,0);let d=0,S=0,E=0,h=0,u=0,M=0,T=0,x=0,b=0,A=0,w=0;f.sort(cp);for(let _=0,g=f.length;_<g;_++){const P=f[_],U=P.color,I=P.intensity,B=P.distance,X=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)m+=U.r*I,p+=U.g*I,l+=U.b*I;else if(P.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(P.sh.coefficients[G],I);w++}else if(P.isDirectionalLight){const G=n.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const ee=P.shadow,W=e.get(P);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,i.directionalShadow[d]=W,i.directionalShadowMap[d]=X,i.directionalShadowMatrix[d]=P.shadow.matrix,M++}i.directional[d]=G,d++}else if(P.isSpotLight){const G=n.get(P);G.position.setFromMatrixPosition(P.matrixWorld),G.color.copy(U).multiplyScalar(I),G.distance=B,G.coneCos=Math.cos(P.angle),G.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),G.decay=P.decay,i.spot[E]=G;const ee=P.shadow;if(P.map&&(i.spotLightMap[b]=P.map,b++,ee.updateMatrices(P),P.castShadow&&A++),i.spotLightMatrix[E]=ee.matrix,P.castShadow){const W=e.get(P);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,i.spotShadow[E]=W,i.spotShadowMap[E]=X,x++}E++}else if(P.isRectAreaLight){const G=n.get(P);G.color.copy(U).multiplyScalar(I),G.halfWidth.set(P.width*.5,0,0),G.halfHeight.set(0,P.height*.5,0),i.rectArea[h]=G,h++}else if(P.isPointLight){const G=n.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),G.distance=P.distance,G.decay=P.decay,P.castShadow){const ee=P.shadow,W=e.get(P);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,W.shadowCameraNear=ee.camera.near,W.shadowCameraFar=ee.camera.far,i.pointShadow[S]=W,i.pointShadowMap[S]=X,i.pointShadowMatrix[S]=P.shadow.matrix,T++}i.point[S]=G,S++}else if(P.isHemisphereLight){const G=n.get(P);G.skyColor.copy(P.color).multiplyScalar(I),G.groundColor.copy(P.groundColor).multiplyScalar(I),i.hemi[u]=G,u++}}h>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=re.LTC_FLOAT_1,i.rectAreaLTC2=re.LTC_FLOAT_2):(i.rectAreaLTC1=re.LTC_HALF_1,i.rectAreaLTC2=re.LTC_HALF_2)),i.ambient[0]=m,i.ambient[1]=p,i.ambient[2]=l;const R=i.hash;(R.directionalLength!==d||R.pointLength!==S||R.spotLength!==E||R.rectAreaLength!==h||R.hemiLength!==u||R.numDirectionalShadows!==M||R.numPointShadows!==T||R.numSpotShadows!==x||R.numSpotMaps!==b||R.numLightProbes!==w)&&(i.directional.length=d,i.spot.length=E,i.rectArea.length=h,i.point.length=S,i.hemi.length=u,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=T,i.pointShadowMap.length=T,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=T,i.spotLightMatrix.length=x+b-A,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=w,R.directionalLength=d,R.pointLength=S,R.spotLength=E,R.rectAreaLength=h,R.hemiLength=u,R.numDirectionalShadows=M,R.numPointShadows=T,R.numSpotShadows=x,R.numSpotMaps=b,R.numLightProbes=w,i.version=op++)}function c(f,m){let p=0,l=0,d=0,S=0,E=0;const h=m.matrixWorldInverse;for(let u=0,M=f.length;u<M;u++){const T=f[u];if(T.isDirectionalLight){const x=i.directional[p];x.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(h),p++}else if(T.isSpotLight){const x=i.spot[d];x.position.setFromMatrixPosition(T.matrixWorld),x.position.applyMatrix4(h),x.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(h),d++}else if(T.isRectAreaLight){const x=i.rectArea[S];x.position.setFromMatrixPosition(T.matrixWorld),x.position.applyMatrix4(h),a.identity(),s.copy(T.matrixWorld),s.premultiply(h),a.extractRotation(s),x.halfWidth.set(T.width*.5,0,0),x.halfHeight.set(0,T.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),S++}else if(T.isPointLight){const x=i.point[l];x.position.setFromMatrixPosition(T.matrixWorld),x.position.applyMatrix4(h),l++}else if(T.isHemisphereLight){const x=i.hemi[E];x.direction.setFromMatrixPosition(T.matrixWorld),x.direction.transformDirection(h),E++}}}return{setup:o,setupView:c,state:i}}function ia(t){const n=new lp(t),e=[],i=[];function r(m){f.camera=m,e.length=0,i.length=0}function s(m){e.push(m)}function a(m){i.push(m)}function o(){n.setup(e)}function c(m){n.setupView(e,m)}const f={lightsArray:e,shadowsArray:i,camera:null,lights:n,transmissionRenderTarget:{}};return{init:r,state:f,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function up(t){let n=new WeakMap;function e(r,s=0){const a=n.get(r);let o;return a===void 0?(o=new ia(t),n.set(r,[o])):s>=a.length?(o=new ia(t),a.push(o)):o=a[s],o}function i(){n=new WeakMap}return{get:e,dispose:i}}const fp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,dp=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function pp(t,n,e){let i=new Sa;const r=new lt,s=new lt,a=new Et,o=new Yo({depthPacking:Ko}),c=new $o,f={},m=e.maxTextureSize,p={[mn]:xt,[xt]:mn,[Lt]:Lt},l=new Ct({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new lt},radius:{value:4}},vertexShader:fp,fragmentShader:dp}),d=l.clone();d.defines.HORIZONTAL_PASS=1;const S=new gn;S.setAttribute("position",new _t(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const E=new wt(S,l),h=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ta;let u=this.type;this.render=function(A,w,R){if(h.enabled===!1||h.autoUpdate===!1&&h.needsUpdate===!1||A.length===0)return;const _=t.getRenderTarget(),g=t.getActiveCubeFace(),P=t.getActiveMipmapLevel(),U=t.state;U.setBlending(pn),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const I=u!==Xt&&this.type===Xt,B=u===Xt&&this.type!==Xt;for(let X=0,G=A.length;X<G;X++){const ee=A[X],W=ee.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;r.copy(W.mapSize);const fe=W.getFrameExtents();if(r.multiply(fe),s.copy(W.mapSize),(r.x>m||r.y>m)&&(r.x>m&&(s.x=Math.floor(m/fe.x),r.x=s.x*fe.x,W.mapSize.x=s.x),r.y>m&&(s.y=Math.floor(m/fe.y),r.y=s.y*fe.y,W.mapSize.y=s.y)),W.map===null||I===!0||B===!0){const Re=this.type!==Xt?{minFilter:dn,magFilter:dn}:{};W.map!==null&&W.map.dispose(),W.map=new kt(r.x,r.y,Re),W.map.texture.name=ee.name+".shadowMap",W.camera.updateProjectionMatrix()}t.setRenderTarget(W.map),t.clear();const ye=W.getViewportCount();for(let Re=0;Re<ye;Re++){const Oe=W.getViewport(Re);a.set(s.x*Oe.x,s.y*Oe.y,s.x*Oe.z,s.y*Oe.w),U.viewport(a),W.updateMatrices(ee,Re),i=W.getFrustum(),x(w,R,W.camera,ee,this.type)}W.isPointLightShadow!==!0&&this.type===Xt&&M(W,R),W.needsUpdate=!1}u=this.type,h.needsUpdate=!1,t.setRenderTarget(_,g,P)};function M(A,w){const R=n.update(E);l.defines.VSM_SAMPLES!==A.blurSamples&&(l.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,l.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new kt(r.x,r.y)),l.uniforms.shadow_pass.value=A.map.texture,l.uniforms.resolution.value=A.mapSize,l.uniforms.radius.value=A.radius,t.setRenderTarget(A.mapPass),t.clear(),t.renderBufferDirect(w,null,R,l,E,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,t.setRenderTarget(A.map),t.clear(),t.renderBufferDirect(w,null,R,d,E,null)}function T(A,w,R,_){let g=null;const P=R.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)g=P;else if(g=R.isPointLight===!0?c:o,t.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){const U=g.uuid,I=w.uuid;let B=f[U];B===void 0&&(B={},f[U]=B);let X=B[I];X===void 0&&(X=g.clone(),B[I]=X,w.addEventListener("dispose",b)),g=X}if(g.visible=w.visible,g.wireframe=w.wireframe,_===Xt?g.side=w.shadowSide!==null?w.shadowSide:w.side:g.side=w.shadowSide!==null?w.shadowSide:p[w.side],g.alphaMap=w.alphaMap,g.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,g.map=w.map,g.clipShadows=w.clipShadows,g.clippingPlanes=w.clippingPlanes,g.clipIntersection=w.clipIntersection,g.displacementMap=w.displacementMap,g.displacementScale=w.displacementScale,g.displacementBias=w.displacementBias,g.wireframeLinewidth=w.wireframeLinewidth,g.linewidth=w.linewidth,R.isPointLight===!0&&g.isMeshDistanceMaterial===!0){const U=t.properties.get(g);U.light=R}return g}function x(A,w,R,_,g){if(A.visible===!1)return;if(A.layers.test(w.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&g===Xt)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,A.matrixWorld);const I=n.update(A),B=A.material;if(Array.isArray(B)){const X=I.groups;for(let G=0,ee=X.length;G<ee;G++){const W=X[G],fe=B[W.materialIndex];if(fe&&fe.visible){const ye=T(A,fe,_,g);A.onBeforeShadow(t,A,w,R,I,ye,W),t.renderBufferDirect(R,null,I,ye,A,W),A.onAfterShadow(t,A,w,R,I,ye,W)}}}else if(B.visible){const X=T(A,B,_,g);A.onBeforeShadow(t,A,w,R,I,X,null),t.renderBufferDirect(R,null,I,X,A,null),A.onAfterShadow(t,A,w,R,I,X,null)}}const U=A.children;for(let I=0,B=U.length;I<B;I++)x(U[I],w,R,_,g)}function b(A){A.target.removeEventListener("dispose",b);for(const R in f){const _=f[R],g=A.target.uuid;g in _&&(_[g].dispose(),delete _[g])}}}const hp={[Er]:Mr,[Sr]:gr,[vr]:mr,[Li]:_r,[Mr]:Er,[gr]:Sr,[mr]:vr,[_r]:Li};function mp(t,n){function e(){let D=!1;const ae=new Et;let j=null;const de=new Et(0,0,0,0);return{setMask:function(J){j!==J&&!D&&(t.colorMask(J,J,J,J),j=J)},setLocked:function(J){D=J},setClear:function(J,$,pe,De,Qe){Qe===!0&&(J*=De,$*=De,pe*=De),ae.set(J,$,pe,De),de.equals(ae)===!1&&(t.clearColor(J,$,pe,De),de.copy(ae))},reset:function(){D=!1,j=null,de.set(-1,0,0,0)}}}function i(){let D=!1,ae=!1,j=null,de=null,J=null;return{setReversed:function($){if(ae!==$){const pe=n.get("EXT_clip_control");$?pe.clipControlEXT(pe.LOWER_LEFT_EXT,pe.ZERO_TO_ONE_EXT):pe.clipControlEXT(pe.LOWER_LEFT_EXT,pe.NEGATIVE_ONE_TO_ONE_EXT),ae=$;const De=J;J=null,this.setClear(De)}},getReversed:function(){return ae},setTest:function($){$?ce(t.DEPTH_TEST):Me(t.DEPTH_TEST)},setMask:function($){j!==$&&!D&&(t.depthMask($),j=$)},setFunc:function($){if(ae&&($=hp[$]),de!==$){switch($){case Er:t.depthFunc(t.NEVER);break;case Mr:t.depthFunc(t.ALWAYS);break;case Sr:t.depthFunc(t.LESS);break;case Li:t.depthFunc(t.LEQUAL);break;case vr:t.depthFunc(t.EQUAL);break;case _r:t.depthFunc(t.GEQUAL);break;case gr:t.depthFunc(t.GREATER);break;case mr:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}de=$}},setLocked:function($){D=$},setClear:function($){J!==$&&(ae&&($=1-$),t.clearDepth($),J=$)},reset:function(){D=!1,j=null,de=null,J=null,ae=!1}}}function r(){let D=!1,ae=null,j=null,de=null,J=null,$=null,pe=null,De=null,Qe=null;return{setTest:function(Xe){D||(Xe?ce(t.STENCIL_TEST):Me(t.STENCIL_TEST))},setMask:function(Xe){ae!==Xe&&!D&&(t.stencilMask(Xe),ae=Xe)},setFunc:function(Xe,Ot,Wt){(j!==Xe||de!==Ot||J!==Wt)&&(t.stencilFunc(Xe,Ot,Wt),j=Xe,de=Ot,J=Wt)},setOp:function(Xe,Ot,Wt){($!==Xe||pe!==Ot||De!==Wt)&&(t.stencilOp(Xe,Ot,Wt),$=Xe,pe=Ot,De=Wt)},setLocked:function(Xe){D=Xe},setClear:function(Xe){Qe!==Xe&&(t.clearStencil(Xe),Qe=Xe)},reset:function(){D=!1,ae=null,j=null,de=null,J=null,$=null,pe=null,De=null,Qe=null}}}const s=new e,a=new i,o=new r,c=new WeakMap,f=new WeakMap;let m={},p={},l=new WeakMap,d=[],S=null,E=!1,h=null,u=null,M=null,T=null,x=null,b=null,A=null,w=new Pe(0,0,0),R=0,_=!1,g=null,P=null,U=null,I=null,B=null;const X=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,ee=0;const W=t.getParameter(t.VERSION);W.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(W)[1]),G=ee>=1):W.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),G=ee>=2);let fe=null,ye={};const Re=t.getParameter(t.SCISSOR_BOX),Oe=t.getParameter(t.VIEWPORT),qe=new Et().fromArray(Re),K=new Et().fromArray(Oe);function ne(D,ae,j,de){const J=new Uint8Array(4),$=t.createTexture();t.bindTexture(D,$),t.texParameteri(D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(D,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let pe=0;pe<j;pe++)D===t.TEXTURE_3D||D===t.TEXTURE_2D_ARRAY?t.texImage3D(ae,0,t.RGBA,1,1,de,0,t.RGBA,t.UNSIGNED_BYTE,J):t.texImage2D(ae+pe,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,J);return $}const Se={};Se[t.TEXTURE_2D]=ne(t.TEXTURE_2D,t.TEXTURE_2D,1),Se[t.TEXTURE_CUBE_MAP]=ne(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),Se[t.TEXTURE_2D_ARRAY]=ne(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),Se[t.TEXTURE_3D]=ne(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ce(t.DEPTH_TEST),a.setFunc(Li),We(!1),$e(As),ce(t.CULL_FACE),L(pn);function ce(D){m[D]!==!0&&(t.enable(D),m[D]=!0)}function Me(D){m[D]!==!1&&(t.disable(D),m[D]=!1)}function He(D,ae){return p[D]!==ae?(t.bindFramebuffer(D,ae),p[D]=ae,D===t.DRAW_FRAMEBUFFER&&(p[t.FRAMEBUFFER]=ae),D===t.FRAMEBUFFER&&(p[t.DRAW_FRAMEBUFFER]=ae),!0):!1}function Ce(D,ae){let j=d,de=!1;if(D){j=l.get(ae),j===void 0&&(j=[],l.set(ae,j));const J=D.textures;if(j.length!==J.length||j[0]!==t.COLOR_ATTACHMENT0){for(let $=0,pe=J.length;$<pe;$++)j[$]=t.COLOR_ATTACHMENT0+$;j.length=J.length,de=!0}}else j[0]!==t.BACK&&(j[0]=t.BACK,de=!0);de&&t.drawBuffers(j)}function tt(D){return S!==D?(t.useProgram(D),S=D,!0):!1}const nt={[Bn]:t.FUNC_ADD,[Mo]:t.FUNC_SUBTRACT,[So]:t.FUNC_REVERSE_SUBTRACT};nt[Cc]=t.MIN,nt[Pc]=t.MAX;const ze={[No]:t.ZERO,[Do]:t.ONE,[Io]:t.SRC_COLOR,[Lo]:t.SRC_ALPHA,[Uo]:t.SRC_ALPHA_SATURATE,[Po]:t.DST_COLOR,[Co]:t.DST_ALPHA,[Ro]:t.ONE_MINUS_SRC_COLOR,[wo]:t.ONE_MINUS_SRC_ALPHA,[bo]:t.ONE_MINUS_DST_COLOR,[yo]:t.ONE_MINUS_DST_ALPHA,[Ao]:t.CONSTANT_COLOR,[xo]:t.ONE_MINUS_CONSTANT_COLOR,[To]:t.CONSTANT_ALPHA,[Eo]:t.ONE_MINUS_CONSTANT_ALPHA};function L(D,ae,j,de,J,$,pe,De,Qe,Xe){if(D===pn){E===!0&&(Me(t.BLEND),E=!1);return}if(E===!1&&(ce(t.BLEND),E=!0),D!==ac){if(D!==h||Xe!==_){if((u!==Bn||x!==Bn)&&(t.blendEquation(t.FUNC_ADD),u=Bn,x=Bn),Xe)switch(D){case Ri:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case rn:t.blendFunc(t.ONE,t.ONE);break;case bs:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case ys:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Ri:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case rn:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case bs:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ys:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}M=null,T=null,b=null,A=null,w.set(0,0,0),R=0,h=D,_=Xe}return}J=J||ae,$=$||j,pe=pe||de,(ae!==u||J!==x)&&(t.blendEquationSeparate(nt[ae],nt[J]),u=ae,x=J),(j!==M||de!==T||$!==b||pe!==A)&&(t.blendFuncSeparate(ze[j],ze[de],ze[$],ze[pe]),M=j,T=de,b=$,A=pe),(De.equals(w)===!1||Qe!==R)&&(t.blendColor(De.r,De.g,De.b,Qe),w.copy(De),R=Qe),h=D,_=!1}function mt(D,ae){D.side===Lt?Me(t.CULL_FACE):ce(t.CULL_FACE);let j=D.side===xt;ae&&(j=!j),We(j),D.blending===Ri&&D.transparent===!1?L(pn):L(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),s.setMask(D.colorWrite);const de=D.stencilWrite;o.setTest(de),de&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),ke(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ce(t.SAMPLE_ALPHA_TO_COVERAGE):Me(t.SAMPLE_ALPHA_TO_COVERAGE)}function We(D){g!==D&&(D?t.frontFace(t.CW):t.frontFace(t.CCW),g=D)}function $e(D){D!==rc?(ce(t.CULL_FACE),D!==P&&(D===As?t.cullFace(t.BACK):D===sc?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Me(t.CULL_FACE),P=D}function ge(D){D!==U&&(G&&t.lineWidth(D),U=D)}function ke(D,ae,j){D?(ce(t.POLYGON_OFFSET_FILL),(I!==ae||B!==j)&&(t.polygonOffset(ae,j),I=ae,B=j)):Me(t.POLYGON_OFFSET_FILL)}function xe(D){D?ce(t.SCISSOR_TEST):Me(t.SCISSOR_TEST)}function Ne(D){D===void 0&&(D=t.TEXTURE0+X-1),fe!==D&&(t.activeTexture(D),fe=D)}function ut(D,ae,j){j===void 0&&(fe===null?j=t.TEXTURE0+X-1:j=fe);let de=ye[j];de===void 0&&(de={type:void 0,texture:void 0},ye[j]=de),(de.type!==D||de.texture!==ae)&&(fe!==j&&(t.activeTexture(j),fe=j),t.bindTexture(D,ae||Se[D]),de.type=D,de.texture=ae)}function C(){const D=ye[fe];D!==void 0&&D.type!==void 0&&(t.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function v(){try{t.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function k(){try{t.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Y(){try{t.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Q(){try{t.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function q(){try{t.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function _e(){try{t.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function se(){try{t.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function me(){try{t.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ve(){try{t.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Z(){try{t.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function le(D){qe.equals(D)===!1&&(t.scissor(D.x,D.y,D.z,D.w),qe.copy(D))}function we(D){K.equals(D)===!1&&(t.viewport(D.x,D.y,D.z,D.w),K.copy(D))}function be(D,ae){let j=f.get(ae);j===void 0&&(j=new WeakMap,f.set(ae,j));let de=j.get(D);de===void 0&&(de=t.getUniformBlockIndex(ae,D.name),j.set(D,de))}function ie(D,ae){const de=f.get(ae).get(D);c.get(ae)!==de&&(t.uniformBlockBinding(ae,de,D.__bindingPointIndex),c.set(ae,de))}function Ie(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),a.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),m={},fe=null,ye={},p={},l=new WeakMap,d=[],S=null,E=!1,h=null,u=null,M=null,T=null,x=null,b=null,A=null,w=new Pe(0,0,0),R=0,_=!1,g=null,P=null,U=null,I=null,B=null,qe.set(0,0,t.canvas.width,t.canvas.height),K.set(0,0,t.canvas.width,t.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ce,disable:Me,bindFramebuffer:He,drawBuffers:Ce,useProgram:tt,setBlending:L,setMaterial:mt,setFlipSided:We,setCullFace:$e,setLineWidth:ge,setPolygonOffset:ke,setScissorTest:xe,activeTexture:Ne,bindTexture:ut,unbindTexture:C,compressedTexImage2D:v,compressedTexImage3D:k,texImage2D:ve,texImage3D:Z,updateUBOMapping:be,uniformBlockBinding:ie,texStorage2D:se,texStorage3D:me,texSubImage2D:Y,texSubImage3D:Q,compressedTexSubImage2D:q,compressedTexSubImage3D:_e,scissor:le,viewport:we,reset:Ie}}function gp(t,n,e,i,r,s,a){const o=n.has("WEBGL_multisampled_render_to_texture")?n.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),f=new lt,m=new WeakMap;let p;const l=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(C,v){return d?new OffscreenCanvas(C,v):yc("canvas")}function E(C,v,k){let Y=1;const Q=ut(C);if((Q.width>k||Q.height>k)&&(Y=k/Math.max(Q.width,Q.height)),Y<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const q=Math.floor(Y*Q.width),_e=Math.floor(Y*Q.height);p===void 0&&(p=S(q,_e));const se=v?S(q,_e):p;return se.width=q,se.height=_e,se.getContext("2d").drawImage(C,0,0,q,_e),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+q+"x"+_e+")."),se}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),C;return C}function h(C){return C.generateMipmaps}function u(C){t.generateMipmap(C)}function M(C){return C.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?t.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function T(C,v,k,Y,Q=!1){if(C!==null){if(t[C]!==void 0)return t[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let q=v;if(v===t.RED&&(k===t.FLOAT&&(q=t.R32F),k===t.HALF_FLOAT&&(q=t.R16F),k===t.UNSIGNED_BYTE&&(q=t.R8)),v===t.RED_INTEGER&&(k===t.UNSIGNED_BYTE&&(q=t.R8UI),k===t.UNSIGNED_SHORT&&(q=t.R16UI),k===t.UNSIGNED_INT&&(q=t.R32UI),k===t.BYTE&&(q=t.R8I),k===t.SHORT&&(q=t.R16I),k===t.INT&&(q=t.R32I)),v===t.RG&&(k===t.FLOAT&&(q=t.RG32F),k===t.HALF_FLOAT&&(q=t.RG16F),k===t.UNSIGNED_BYTE&&(q=t.RG8)),v===t.RG_INTEGER&&(k===t.UNSIGNED_BYTE&&(q=t.RG8UI),k===t.UNSIGNED_SHORT&&(q=t.RG16UI),k===t.UNSIGNED_INT&&(q=t.RG32UI),k===t.BYTE&&(q=t.RG8I),k===t.SHORT&&(q=t.RG16I),k===t.INT&&(q=t.RG32I)),v===t.RGB_INTEGER&&(k===t.UNSIGNED_BYTE&&(q=t.RGB8UI),k===t.UNSIGNED_SHORT&&(q=t.RGB16UI),k===t.UNSIGNED_INT&&(q=t.RGB32UI),k===t.BYTE&&(q=t.RGB8I),k===t.SHORT&&(q=t.RGB16I),k===t.INT&&(q=t.RGB32I)),v===t.RGBA_INTEGER&&(k===t.UNSIGNED_BYTE&&(q=t.RGBA8UI),k===t.UNSIGNED_SHORT&&(q=t.RGBA16UI),k===t.UNSIGNED_INT&&(q=t.RGBA32UI),k===t.BYTE&&(q=t.RGBA8I),k===t.SHORT&&(q=t.RGBA16I),k===t.INT&&(q=t.RGBA32I)),v===t.RGB&&k===t.UNSIGNED_INT_5_9_9_9_REV&&(q=t.RGB9_E5),v===t.RGBA){const _e=Q?Da:ot.getTransfer(Y);k===t.FLOAT&&(q=t.RGBA32F),k===t.HALF_FLOAT&&(q=t.RGBA16F),k===t.UNSIGNED_BYTE&&(q=_e===je?t.SRGB8_ALPHA8:t.RGBA8),k===t.UNSIGNED_SHORT_4_4_4_4&&(q=t.RGBA4),k===t.UNSIGNED_SHORT_5_5_5_1&&(q=t.RGB5_A1)}return(q===t.R16F||q===t.R32F||q===t.RG16F||q===t.RG32F||q===t.RGBA16F||q===t.RGBA32F)&&n.get("EXT_color_buffer_float"),q}function x(C,v){let k;return C?v===null||v===ii||v===ni?k=t.DEPTH24_STENCIL8:v===Gt?k=t.DEPTH32F_STENCIL8:v===Ii&&(k=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===ii||v===ni?k=t.DEPTH_COMPONENT24:v===Gt?k=t.DEPTH_COMPONENT32F:v===Ii&&(k=t.DEPTH_COMPONENT16),k}function b(C,v){return h(C)===!0||C.isFramebufferTexture&&C.minFilter!==dn&&C.minFilter!==Pn?Math.log2(Math.max(v.width,v.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?v.mipmaps.length:1}function A(C){const v=C.target;v.removeEventListener("dispose",A),R(v),v.isVideoTexture&&m.delete(v)}function w(C){const v=C.target;v.removeEventListener("dispose",w),g(v)}function R(C){const v=i.get(C);if(v.__webglInit===void 0)return;const k=C.source,Y=l.get(k);if(Y){const Q=Y[v.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&_(C),Object.keys(Y).length===0&&l.delete(k)}i.remove(C)}function _(C){const v=i.get(C);t.deleteTexture(v.__webglTexture);const k=C.source,Y=l.get(k);delete Y[v.__cacheKey],a.memory.textures--}function g(C){const v=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(v.__webglFramebuffer[Y]))for(let Q=0;Q<v.__webglFramebuffer[Y].length;Q++)t.deleteFramebuffer(v.__webglFramebuffer[Y][Q]);else t.deleteFramebuffer(v.__webglFramebuffer[Y]);v.__webglDepthbuffer&&t.deleteRenderbuffer(v.__webglDepthbuffer[Y])}else{if(Array.isArray(v.__webglFramebuffer))for(let Y=0;Y<v.__webglFramebuffer.length;Y++)t.deleteFramebuffer(v.__webglFramebuffer[Y]);else t.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&t.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&t.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let Y=0;Y<v.__webglColorRenderbuffer.length;Y++)v.__webglColorRenderbuffer[Y]&&t.deleteRenderbuffer(v.__webglColorRenderbuffer[Y]);v.__webglDepthRenderbuffer&&t.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const k=C.textures;for(let Y=0,Q=k.length;Y<Q;Y++){const q=i.get(k[Y]);q.__webglTexture&&(t.deleteTexture(q.__webglTexture),a.memory.textures--),i.remove(k[Y])}i.remove(C)}let P=0;function U(){P=0}function I(){const C=P;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),P+=1,C}function B(C){const v=[];return v.push(C.wrapS),v.push(C.wrapT),v.push(C.wrapR||0),v.push(C.magFilter),v.push(C.minFilter),v.push(C.anisotropy),v.push(C.internalFormat),v.push(C.format),v.push(C.type),v.push(C.generateMipmaps),v.push(C.premultiplyAlpha),v.push(C.flipY),v.push(C.unpackAlignment),v.push(C.colorSpace),v.join()}function X(C,v){const k=i.get(C);if(C.isVideoTexture&&xe(C),C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){const Y=C.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Se(k,C,v);return}}e.bindTexture(t.TEXTURE_2D,k.__webglTexture,t.TEXTURE0+v)}function G(C,v){const k=i.get(C);if(C.version>0&&k.__version!==C.version){Se(k,C,v);return}e.bindTexture(t.TEXTURE_2D_ARRAY,k.__webglTexture,t.TEXTURE0+v)}function ee(C,v){const k=i.get(C);if(C.version>0&&k.__version!==C.version){Se(k,C,v);return}e.bindTexture(t.TEXTURE_3D,k.__webglTexture,t.TEXTURE0+v)}function W(C,v){const k=i.get(C);if(C.version>0&&k.__version!==C.version){ce(k,C,v);return}e.bindTexture(t.TEXTURE_CUBE_MAP,k.__webglTexture,t.TEXTURE0+v)}const fe={[Bo]:t.REPEAT,[Oo]:t.CLAMP_TO_EDGE,[Fo]:t.MIRRORED_REPEAT},ye={[dn]:t.NEAREST,[ko]:t.NEAREST_MIPMAP_NEAREST,[oi]:t.NEAREST_MIPMAP_LINEAR,[Pn]:t.LINEAR,[qi]:t.LINEAR_MIPMAP_NEAREST,[Yn]:t.LINEAR_MIPMAP_LINEAR},Re={[qo]:t.NEVER,[Xo]:t.ALWAYS,[Wo]:t.LESS,[Ea]:t.LEQUAL,[zo]:t.EQUAL,[Ho]:t.GEQUAL,[Vo]:t.GREATER,[Go]:t.NOTEQUAL};function Oe(C,v){if(v.type===Gt&&n.has("OES_texture_float_linear")===!1&&(v.magFilter===Pn||v.magFilter===qi||v.magFilter===oi||v.magFilter===Yn||v.minFilter===Pn||v.minFilter===qi||v.minFilter===oi||v.minFilter===Yn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(C,t.TEXTURE_WRAP_S,fe[v.wrapS]),t.texParameteri(C,t.TEXTURE_WRAP_T,fe[v.wrapT]),(C===t.TEXTURE_3D||C===t.TEXTURE_2D_ARRAY)&&t.texParameteri(C,t.TEXTURE_WRAP_R,fe[v.wrapR]),t.texParameteri(C,t.TEXTURE_MAG_FILTER,ye[v.magFilter]),t.texParameteri(C,t.TEXTURE_MIN_FILTER,ye[v.minFilter]),v.compareFunction&&(t.texParameteri(C,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(C,t.TEXTURE_COMPARE_FUNC,Re[v.compareFunction])),n.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===dn||v.minFilter!==oi&&v.minFilter!==Yn||v.type===Gt&&n.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const k=n.get("EXT_texture_filter_anisotropic");t.texParameterf(C,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function qe(C,v){let k=!1;C.__webglInit===void 0&&(C.__webglInit=!0,v.addEventListener("dispose",A));const Y=v.source;let Q=l.get(Y);Q===void 0&&(Q={},l.set(Y,Q));const q=B(v);if(q!==C.__cacheKey){Q[q]===void 0&&(Q[q]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,k=!0),Q[q].usedTimes++;const _e=Q[C.__cacheKey];_e!==void 0&&(Q[C.__cacheKey].usedTimes--,_e.usedTimes===0&&_(v)),C.__cacheKey=q,C.__webglTexture=Q[q].texture}return k}function K(C,v,k){return Math.floor(Math.floor(C/k)/v)}function ne(C,v,k,Y){const q=C.updateRanges;if(q.length===0)e.texSubImage2D(t.TEXTURE_2D,0,0,0,v.width,v.height,k,Y,v.data);else{q.sort((Z,le)=>Z.start-le.start);let _e=0;for(let Z=1;Z<q.length;Z++){const le=q[_e],we=q[Z],be=le.start+le.count,ie=K(we.start,v.width,4),Ie=K(le.start,v.width,4);we.start<=be+1&&ie===Ie&&K(we.start+we.count-1,v.width,4)===ie?le.count=Math.max(le.count,we.start+we.count-le.start):(++_e,q[_e]=we)}q.length=_e+1;const se=t.getParameter(t.UNPACK_ROW_LENGTH),me=t.getParameter(t.UNPACK_SKIP_PIXELS),ve=t.getParameter(t.UNPACK_SKIP_ROWS);t.pixelStorei(t.UNPACK_ROW_LENGTH,v.width);for(let Z=0,le=q.length;Z<le;Z++){const we=q[Z],be=Math.floor(we.start/4),ie=Math.ceil(we.count/4),Ie=be%v.width,D=Math.floor(be/v.width),ae=ie,j=1;t.pixelStorei(t.UNPACK_SKIP_PIXELS,Ie),t.pixelStorei(t.UNPACK_SKIP_ROWS,D),e.texSubImage2D(t.TEXTURE_2D,0,Ie,D,ae,j,k,Y,v.data)}C.clearUpdateRanges(),t.pixelStorei(t.UNPACK_ROW_LENGTH,se),t.pixelStorei(t.UNPACK_SKIP_PIXELS,me),t.pixelStorei(t.UNPACK_SKIP_ROWS,ve)}}function Se(C,v,k){let Y=t.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(Y=t.TEXTURE_2D_ARRAY),v.isData3DTexture&&(Y=t.TEXTURE_3D);const Q=qe(C,v),q=v.source;e.bindTexture(Y,C.__webglTexture,t.TEXTURE0+k);const _e=i.get(q);if(q.version!==_e.__version||Q===!0){e.activeTexture(t.TEXTURE0+k);const se=ot.getPrimaries(ot.workingColorSpace),me=v.colorSpace===Cn?null:ot.getPrimaries(v.colorSpace),ve=v.colorSpace===Cn||se===me?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);let Z=E(v.image,!1,r.maxTextureSize);Z=Ne(v,Z);const le=s.convert(v.format,v.colorSpace),we=s.convert(v.type);let be=T(v.internalFormat,le,we,v.colorSpace,v.isVideoTexture);Oe(Y,v);let ie;const Ie=v.mipmaps,D=v.isVideoTexture!==!0,ae=_e.__version===void 0||Q===!0,j=q.dataReady,de=b(v,Z);if(v.isDepthTexture)be=x(v.format===Ui,v.type),ae&&(D?e.texStorage2D(t.TEXTURE_2D,1,be,Z.width,Z.height):e.texImage2D(t.TEXTURE_2D,0,be,Z.width,Z.height,0,le,we,null));else if(v.isDataTexture)if(Ie.length>0){D&&ae&&e.texStorage2D(t.TEXTURE_2D,de,be,Ie[0].width,Ie[0].height);for(let J=0,$=Ie.length;J<$;J++)ie=Ie[J],D?j&&e.texSubImage2D(t.TEXTURE_2D,J,0,0,ie.width,ie.height,le,we,ie.data):e.texImage2D(t.TEXTURE_2D,J,be,ie.width,ie.height,0,le,we,ie.data);v.generateMipmaps=!1}else D?(ae&&e.texStorage2D(t.TEXTURE_2D,de,be,Z.width,Z.height),j&&ne(v,Z,le,we)):e.texImage2D(t.TEXTURE_2D,0,be,Z.width,Z.height,0,le,we,Z.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){D&&ae&&e.texStorage3D(t.TEXTURE_2D_ARRAY,de,be,Ie[0].width,Ie[0].height,Z.depth);for(let J=0,$=Ie.length;J<$;J++)if(ie=Ie[J],v.format!==bt)if(le!==null)if(D){if(j)if(v.layerUpdates.size>0){const pe=Rs(ie.width,ie.height,v.format,v.type);for(const De of v.layerUpdates){const Qe=ie.data.subarray(De*pe/ie.data.BYTES_PER_ELEMENT,(De+1)*pe/ie.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,De,ie.width,ie.height,1,le,Qe)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,0,ie.width,ie.height,Z.depth,le,ie.data)}else e.compressedTexImage3D(t.TEXTURE_2D_ARRAY,J,be,ie.width,ie.height,Z.depth,0,ie.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?j&&e.texSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,0,ie.width,ie.height,Z.depth,le,we,ie.data):e.texImage3D(t.TEXTURE_2D_ARRAY,J,be,ie.width,ie.height,Z.depth,0,le,we,ie.data)}else{D&&ae&&e.texStorage2D(t.TEXTURE_2D,de,be,Ie[0].width,Ie[0].height);for(let J=0,$=Ie.length;J<$;J++)ie=Ie[J],v.format!==bt?le!==null?D?j&&e.compressedTexSubImage2D(t.TEXTURE_2D,J,0,0,ie.width,ie.height,le,ie.data):e.compressedTexImage2D(t.TEXTURE_2D,J,be,ie.width,ie.height,0,ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?j&&e.texSubImage2D(t.TEXTURE_2D,J,0,0,ie.width,ie.height,le,we,ie.data):e.texImage2D(t.TEXTURE_2D,J,be,ie.width,ie.height,0,le,we,ie.data)}else if(v.isDataArrayTexture)if(D){if(ae&&e.texStorage3D(t.TEXTURE_2D_ARRAY,de,be,Z.width,Z.height,Z.depth),j)if(v.layerUpdates.size>0){const J=Rs(Z.width,Z.height,v.format,v.type);for(const $ of v.layerUpdates){const pe=Z.data.subarray($*J/Z.data.BYTES_PER_ELEMENT,($+1)*J/Z.data.BYTES_PER_ELEMENT);e.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,$,Z.width,Z.height,1,le,we,pe)}v.clearLayerUpdates()}else e.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,le,we,Z.data)}else e.texImage3D(t.TEXTURE_2D_ARRAY,0,be,Z.width,Z.height,Z.depth,0,le,we,Z.data);else if(v.isData3DTexture)D?(ae&&e.texStorage3D(t.TEXTURE_3D,de,be,Z.width,Z.height,Z.depth),j&&e.texSubImage3D(t.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,le,we,Z.data)):e.texImage3D(t.TEXTURE_3D,0,be,Z.width,Z.height,Z.depth,0,le,we,Z.data);else if(v.isFramebufferTexture){if(ae)if(D)e.texStorage2D(t.TEXTURE_2D,de,be,Z.width,Z.height);else{let J=Z.width,$=Z.height;for(let pe=0;pe<de;pe++)e.texImage2D(t.TEXTURE_2D,pe,be,J,$,0,le,we,null),J>>=1,$>>=1}}else if(Ie.length>0){if(D&&ae){const J=ut(Ie[0]);e.texStorage2D(t.TEXTURE_2D,de,be,J.width,J.height)}for(let J=0,$=Ie.length;J<$;J++)ie=Ie[J],D?j&&e.texSubImage2D(t.TEXTURE_2D,J,0,0,le,we,ie):e.texImage2D(t.TEXTURE_2D,J,be,le,we,ie);v.generateMipmaps=!1}else if(D){if(ae){const J=ut(Z);e.texStorage2D(t.TEXTURE_2D,de,be,J.width,J.height)}j&&e.texSubImage2D(t.TEXTURE_2D,0,0,0,le,we,Z)}else e.texImage2D(t.TEXTURE_2D,0,be,le,we,Z);h(v)&&u(Y),_e.__version=q.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function ce(C,v,k){if(v.image.length!==6)return;const Y=qe(C,v),Q=v.source;e.bindTexture(t.TEXTURE_CUBE_MAP,C.__webglTexture,t.TEXTURE0+k);const q=i.get(Q);if(Q.version!==q.__version||Y===!0){e.activeTexture(t.TEXTURE0+k);const _e=ot.getPrimaries(ot.workingColorSpace),se=v.colorSpace===Cn?null:ot.getPrimaries(v.colorSpace),me=v.colorSpace===Cn||_e===se?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);const ve=v.isCompressedTexture||v.image[0].isCompressedTexture,Z=v.image[0]&&v.image[0].isDataTexture,le=[];for(let $=0;$<6;$++)!ve&&!Z?le[$]=E(v.image[$],!0,r.maxCubemapSize):le[$]=Z?v.image[$].image:v.image[$],le[$]=Ne(v,le[$]);const we=le[0],be=s.convert(v.format,v.colorSpace),ie=s.convert(v.type),Ie=T(v.internalFormat,be,ie,v.colorSpace),D=v.isVideoTexture!==!0,ae=q.__version===void 0||Y===!0,j=Q.dataReady;let de=b(v,we);Oe(t.TEXTURE_CUBE_MAP,v);let J;if(ve){D&&ae&&e.texStorage2D(t.TEXTURE_CUBE_MAP,de,Ie,we.width,we.height);for(let $=0;$<6;$++){J=le[$].mipmaps;for(let pe=0;pe<J.length;pe++){const De=J[pe];v.format!==bt?be!==null?D?j&&e.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+$,pe,0,0,De.width,De.height,be,De.data):e.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+$,pe,Ie,De.width,De.height,0,De.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?j&&e.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+$,pe,0,0,De.width,De.height,be,ie,De.data):e.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+$,pe,Ie,De.width,De.height,0,be,ie,De.data)}}}else{if(J=v.mipmaps,D&&ae){J.length>0&&de++;const $=ut(le[0]);e.texStorage2D(t.TEXTURE_CUBE_MAP,de,Ie,$.width,$.height)}for(let $=0;$<6;$++)if(Z){D?j&&e.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,le[$].width,le[$].height,be,ie,le[$].data):e.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ie,le[$].width,le[$].height,0,be,ie,le[$].data);for(let pe=0;pe<J.length;pe++){const Qe=J[pe].image[$].image;D?j&&e.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+$,pe+1,0,0,Qe.width,Qe.height,be,ie,Qe.data):e.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+$,pe+1,Ie,Qe.width,Qe.height,0,be,ie,Qe.data)}}else{D?j&&e.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,be,ie,le[$]):e.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ie,be,ie,le[$]);for(let pe=0;pe<J.length;pe++){const De=J[pe];D?j&&e.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+$,pe+1,0,0,be,ie,De.image[$]):e.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+$,pe+1,Ie,be,ie,De.image[$])}}}h(v)&&u(t.TEXTURE_CUBE_MAP),q.__version=Q.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function Me(C,v,k,Y,Q,q){const _e=s.convert(k.format,k.colorSpace),se=s.convert(k.type),me=T(k.internalFormat,_e,se,k.colorSpace),ve=i.get(v),Z=i.get(k);if(Z.__renderTarget=v,!ve.__hasExternalTextures){const le=Math.max(1,v.width>>q),we=Math.max(1,v.height>>q);Q===t.TEXTURE_3D||Q===t.TEXTURE_2D_ARRAY?e.texImage3D(Q,q,me,le,we,v.depth,0,_e,se,null):e.texImage2D(Q,q,me,le,we,0,_e,se,null)}e.bindFramebuffer(t.FRAMEBUFFER,C),ke(v)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Y,Q,Z.__webglTexture,0,ge(v)):(Q===t.TEXTURE_2D||Q>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,Y,Q,Z.__webglTexture,q),e.bindFramebuffer(t.FRAMEBUFFER,null)}function He(C,v,k){if(t.bindRenderbuffer(t.RENDERBUFFER,C),v.depthBuffer){const Y=v.depthTexture,Q=Y&&Y.isDepthTexture?Y.type:null,q=x(v.stencilBuffer,Q),_e=v.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,se=ge(v);ke(v)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,se,q,v.width,v.height):k?t.renderbufferStorageMultisample(t.RENDERBUFFER,se,q,v.width,v.height):t.renderbufferStorage(t.RENDERBUFFER,q,v.width,v.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,_e,t.RENDERBUFFER,C)}else{const Y=v.textures;for(let Q=0;Q<Y.length;Q++){const q=Y[Q],_e=s.convert(q.format,q.colorSpace),se=s.convert(q.type),me=T(q.internalFormat,_e,se,q.colorSpace),ve=ge(v);k&&ke(v)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,ve,me,v.width,v.height):ke(v)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ve,me,v.width,v.height):t.renderbufferStorage(t.RENDERBUFFER,me,v.width,v.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Ce(C,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(t.FRAMEBUFFER,C),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=i.get(v.depthTexture);Y.__renderTarget=v,(!Y.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),X(v.depthTexture,0);const Q=Y.__webglTexture,q=ge(v);if(v.depthTexture.format===Or)ke(v)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Q,0,q):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Q,0);else if(v.depthTexture.format===Ui)ke(v)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Q,0,q):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function tt(C){const v=i.get(C),k=C.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==C.depthTexture){const Y=C.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),Y){const Q=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,Y.removeEventListener("dispose",Q)};Y.addEventListener("dispose",Q),v.__depthDisposeCallback=Q}v.__boundDepthTexture=Y}if(C.depthTexture&&!v.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");const Y=C.texture.mipmaps;Y&&Y.length>0?Ce(v.__webglFramebuffer[0],C):Ce(v.__webglFramebuffer,C)}else if(k){v.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(t.FRAMEBUFFER,v.__webglFramebuffer[Y]),v.__webglDepthbuffer[Y]===void 0)v.__webglDepthbuffer[Y]=t.createRenderbuffer(),He(v.__webglDepthbuffer[Y],C,!1);else{const Q=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,q=v.__webglDepthbuffer[Y];t.bindRenderbuffer(t.RENDERBUFFER,q),t.framebufferRenderbuffer(t.FRAMEBUFFER,Q,t.RENDERBUFFER,q)}}else{const Y=C.texture.mipmaps;if(Y&&Y.length>0?e.bindFramebuffer(t.FRAMEBUFFER,v.__webglFramebuffer[0]):e.bindFramebuffer(t.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=t.createRenderbuffer(),He(v.__webglDepthbuffer,C,!1);else{const Q=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,q=v.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,q),t.framebufferRenderbuffer(t.FRAMEBUFFER,Q,t.RENDERBUFFER,q)}}e.bindFramebuffer(t.FRAMEBUFFER,null)}function nt(C,v,k){const Y=i.get(C);v!==void 0&&Me(Y.__webglFramebuffer,C,C.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),k!==void 0&&tt(C)}function ze(C){const v=C.texture,k=i.get(C),Y=i.get(v);C.addEventListener("dispose",w);const Q=C.textures,q=C.isWebGLCubeRenderTarget===!0,_e=Q.length>1;if(_e||(Y.__webglTexture===void 0&&(Y.__webglTexture=t.createTexture()),Y.__version=v.version,a.memory.textures++),q){k.__webglFramebuffer=[];for(let se=0;se<6;se++)if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer[se]=[];for(let me=0;me<v.mipmaps.length;me++)k.__webglFramebuffer[se][me]=t.createFramebuffer()}else k.__webglFramebuffer[se]=t.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer=[];for(let se=0;se<v.mipmaps.length;se++)k.__webglFramebuffer[se]=t.createFramebuffer()}else k.__webglFramebuffer=t.createFramebuffer();if(_e)for(let se=0,me=Q.length;se<me;se++){const ve=i.get(Q[se]);ve.__webglTexture===void 0&&(ve.__webglTexture=t.createTexture(),a.memory.textures++)}if(C.samples>0&&ke(C)===!1){k.__webglMultisampledFramebuffer=t.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(t.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let se=0;se<Q.length;se++){const me=Q[se];k.__webglColorRenderbuffer[se]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,k.__webglColorRenderbuffer[se]);const ve=s.convert(me.format,me.colorSpace),Z=s.convert(me.type),le=T(me.internalFormat,ve,Z,me.colorSpace,C.isXRRenderTarget===!0),we=ge(C);t.renderbufferStorageMultisample(t.RENDERBUFFER,we,le,C.width,C.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+se,t.RENDERBUFFER,k.__webglColorRenderbuffer[se])}t.bindRenderbuffer(t.RENDERBUFFER,null),C.depthBuffer&&(k.__webglDepthRenderbuffer=t.createRenderbuffer(),He(k.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(t.FRAMEBUFFER,null)}}if(q){e.bindTexture(t.TEXTURE_CUBE_MAP,Y.__webglTexture),Oe(t.TEXTURE_CUBE_MAP,v);for(let se=0;se<6;se++)if(v.mipmaps&&v.mipmaps.length>0)for(let me=0;me<v.mipmaps.length;me++)Me(k.__webglFramebuffer[se][me],C,v,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+se,me);else Me(k.__webglFramebuffer[se],C,v,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0);h(v)&&u(t.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(_e){for(let se=0,me=Q.length;se<me;se++){const ve=Q[se],Z=i.get(ve);e.bindTexture(t.TEXTURE_2D,Z.__webglTexture),Oe(t.TEXTURE_2D,ve),Me(k.__webglFramebuffer,C,ve,t.COLOR_ATTACHMENT0+se,t.TEXTURE_2D,0),h(ve)&&u(t.TEXTURE_2D)}e.unbindTexture()}else{let se=t.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(se=C.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),e.bindTexture(se,Y.__webglTexture),Oe(se,v),v.mipmaps&&v.mipmaps.length>0)for(let me=0;me<v.mipmaps.length;me++)Me(k.__webglFramebuffer[me],C,v,t.COLOR_ATTACHMENT0,se,me);else Me(k.__webglFramebuffer,C,v,t.COLOR_ATTACHMENT0,se,0);h(v)&&u(se),e.unbindTexture()}C.depthBuffer&&tt(C)}function L(C){const v=C.textures;for(let k=0,Y=v.length;k<Y;k++){const Q=v[k];if(h(Q)){const q=M(C),_e=i.get(Q).__webglTexture;e.bindTexture(q,_e),u(q),e.unbindTexture()}}}const mt=[],We=[];function $e(C){if(C.samples>0){if(ke(C)===!1){const v=C.textures,k=C.width,Y=C.height;let Q=t.COLOR_BUFFER_BIT;const q=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,_e=i.get(C),se=v.length>1;if(se)for(let ve=0;ve<v.length;ve++)e.bindFramebuffer(t.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,null),e.bindFramebuffer(t.FRAMEBUFFER,_e.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,null,0);e.bindFramebuffer(t.READ_FRAMEBUFFER,_e.__webglMultisampledFramebuffer);const me=C.texture.mipmaps;me&&me.length>0?e.bindFramebuffer(t.DRAW_FRAMEBUFFER,_e.__webglFramebuffer[0]):e.bindFramebuffer(t.DRAW_FRAMEBUFFER,_e.__webglFramebuffer);for(let ve=0;ve<v.length;ve++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(Q|=t.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(Q|=t.STENCIL_BUFFER_BIT)),se){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,_e.__webglColorRenderbuffer[ve]);const Z=i.get(v[ve]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Z,0)}t.blitFramebuffer(0,0,k,Y,0,0,k,Y,Q,t.NEAREST),c===!0&&(mt.length=0,We.length=0,mt.push(t.COLOR_ATTACHMENT0+ve),C.depthBuffer&&C.resolveDepthBuffer===!1&&(mt.push(q),We.push(q),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,We)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,mt))}if(e.bindFramebuffer(t.READ_FRAMEBUFFER,null),e.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),se)for(let ve=0;ve<v.length;ve++){e.bindFramebuffer(t.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,_e.__webglColorRenderbuffer[ve]);const Z=i.get(v[ve]).__webglTexture;e.bindFramebuffer(t.FRAMEBUFFER,_e.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,Z,0)}e.bindFramebuffer(t.DRAW_FRAMEBUFFER,_e.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const v=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[v])}}}function ge(C){return Math.min(r.maxSamples,C.samples)}function ke(C){const v=i.get(C);return C.samples>0&&n.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function xe(C){const v=a.render.frame;m.get(C)!==v&&(m.set(C,v),C.update())}function Ne(C,v){const k=C.colorSpace,Y=C.format,Q=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||k!==Bi&&k!==Cn&&(ot.getTransfer(k)===je?(Y!==bt||Q!==hn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),v}function ut(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(f.width=C.naturalWidth||C.width,f.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(f.width=C.displayWidth,f.height=C.displayHeight):(f.width=C.width,f.height=C.height),f}this.allocateTextureUnit=I,this.resetTextureUnits=U,this.setTexture2D=X,this.setTexture2DArray=G,this.setTexture3D=ee,this.setTextureCube=W,this.rebindTextures=nt,this.setupRenderTarget=ze,this.updateRenderTargetMipmap=L,this.updateMultisampleRenderTarget=$e,this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=ke}function _p(t,n){function e(i,r=Cn){let s;const a=ot.getTransfer(r);if(i===hn)return t.UNSIGNED_BYTE;if(i===xa)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Aa)return t.UNSIGNED_SHORT_5_5_5_1;if(i===Qo)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===Zo)return t.BYTE;if(i===jo)return t.SHORT;if(i===Ii)return t.UNSIGNED_SHORT;if(i===ba)return t.INT;if(i===ii)return t.UNSIGNED_INT;if(i===Gt)return t.FLOAT;if(i===Oi)return t.HALF_FLOAT;if(i===Jo)return t.ALPHA;if(i===ec)return t.RGB;if(i===bt)return t.RGBA;if(i===Or)return t.DEPTH_COMPONENT;if(i===Ui)return t.DEPTH_STENCIL;if(i===tc)return t.RED;if(i===wa)return t.RED_INTEGER;if(i===nc)return t.RG;if(i===Ra)return t.RG_INTEGER;if(i===Ca)return t.RGBA_INTEGER;if(i===Yi||i===Ki||i===$i||i===Qi)if(a===je)if(s=n.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Yi)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ki)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===$i)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Qi)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=n.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Yi)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ki)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===$i)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Qi)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===jr||i===Jr||i===es||i===ts)if(s=n.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===jr)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Jr)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===es)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ts)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ns||i===is||i===rs)if(s=n.get("WEBGL_compressed_texture_etc"),s!==null){if(i===ns||i===is)return a===je?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===rs)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===ss||i===as||i===os||i===cs||i===ls||i===us||i===fs||i===ds||i===ps||i===hs||i===ms||i===gs||i===_s||i===vs)if(s=n.get("WEBGL_compressed_texture_astc"),s!==null){if(i===ss)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===as)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===os)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===cs)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ls)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===us)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===fs)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ds)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ps)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===hs)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ms)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===gs)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===_s)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===vs)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Zi||i===Ss||i===Ms)if(s=n.get("EXT_texture_compression_bptc"),s!==null){if(i===Zi)return a===je?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ss)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ms)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ic||i===Es||i===Ts||i===xs)if(s=n.get("EXT_texture_compression_rgtc"),s!==null){if(i===Zi)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Es)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ts)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===xs)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ni?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:e}}const vp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Sp=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Mp{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(n,e,i){if(this.texture===null){const r=new ya,s=n.properties.get(r);s.__webglTexture=e.texture,(e.depthNear!==i.depthNear||e.depthFar!==i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(n){if(this.texture!==null&&this.mesh===null){const e=n.cameras[0].viewport,i=new Ct({vertexShader:vp,fragmentShader:Sp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new wt(new Di(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ep extends go{constructor(n,e){super();const i=this;let r=null,s=1,a=null,o="local-floor",c=1,f=null,m=null,p=null,l=null,d=null,S=null;const E=new Mp,h=e.getContextAttributes();let u=null,M=null;const T=[],x=[],b=new lt;let A=null;const w=new jn;w.viewport=new Et;const R=new jn;R.viewport=new Et;const _=[w,R],g=new _o;let P=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let ne=T[K];return ne===void 0&&(ne=new Xi,T[K]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(K){let ne=T[K];return ne===void 0&&(ne=new Xi,T[K]=ne),ne.getGripSpace()},this.getHand=function(K){let ne=T[K];return ne===void 0&&(ne=new Xi,T[K]=ne),ne.getHandSpace()};function I(K){const ne=x.indexOf(K.inputSource);if(ne===-1)return;const Se=T[ne];Se!==void 0&&(Se.update(K.inputSource,K.frame,f||a),Se.dispatchEvent({type:K.type,data:K.inputSource}))}function B(){r.removeEventListener("select",I),r.removeEventListener("selectstart",I),r.removeEventListener("selectend",I),r.removeEventListener("squeeze",I),r.removeEventListener("squeezestart",I),r.removeEventListener("squeezeend",I),r.removeEventListener("end",B),r.removeEventListener("inputsourceschange",X);for(let K=0;K<T.length;K++){const ne=x[K];ne!==null&&(x[K]=null,T[K].disconnect(ne))}P=null,U=null,E.reset(),n.setRenderTarget(u),d=null,l=null,p=null,r=null,M=null,qe.stop(),i.isPresenting=!1,n.setPixelRatio(A),n.setSize(b.width,b.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){s=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return f||a},this.setReferenceSpace=function(K){f=K},this.getBaseLayer=function(){return l!==null?l:d},this.getBinding=function(){return p},this.getFrame=function(){return S},this.getSession=function(){return r},this.setSession=async function(K){if(r=K,r!==null){if(u=n.getRenderTarget(),r.addEventListener("select",I),r.addEventListener("selectstart",I),r.addEventListener("selectend",I),r.addEventListener("squeeze",I),r.addEventListener("squeezestart",I),r.addEventListener("squeezeend",I),r.addEventListener("end",B),r.addEventListener("inputsourceschange",X),h.xrCompatible!==!0&&await e.makeXRCompatible(),A=n.getPixelRatio(),n.getSize(b),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,ce=null,Me=null;h.depth&&(Me=h.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Se=h.stencil?Ui:Or,ce=h.stencil?ni:ii);const He={colorFormat:e.RGBA8,depthFormat:Me,scaleFactor:s};p=new XRWebGLBinding(r,e),l=p.createProjectionLayer(He),r.updateRenderState({layers:[l]}),n.setPixelRatio(1),n.setSize(l.textureWidth,l.textureHeight,!1),M=new kt(l.textureWidth,l.textureHeight,{format:bt,type:hn,depthTexture:new Ma(l.textureWidth,l.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:h.stencil,colorSpace:n.outputColorSpace,samples:h.antialias?4:0,resolveDepthBuffer:l.ignoreDepthValues===!1,resolveStencilBuffer:l.ignoreDepthValues===!1})}else{const Se={antialias:h.antialias,alpha:!0,depth:h.depth,stencil:h.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,e,Se),r.updateRenderState({baseLayer:d}),n.setPixelRatio(1),n.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new kt(d.framebufferWidth,d.framebufferHeight,{format:bt,type:hn,colorSpace:n.outputColorSpace,stencilBuffer:h.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),f=null,a=await r.requestReferenceSpace(o),qe.setContext(r),qe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return E.getDepthTexture()};function X(K){for(let ne=0;ne<K.removed.length;ne++){const Se=K.removed[ne],ce=x.indexOf(Se);ce>=0&&(x[ce]=null,T[ce].disconnect(Se))}for(let ne=0;ne<K.added.length;ne++){const Se=K.added[ne];let ce=x.indexOf(Se);if(ce===-1){for(let He=0;He<T.length;He++)if(He>=x.length){x.push(Se),ce=He;break}else if(x[He]===null){x[He]=Se,ce=He;break}if(ce===-1)break}const Me=T[ce];Me&&Me.connect(Se)}}const G=new z,ee=new z;function W(K,ne,Se){G.setFromMatrixPosition(ne.matrixWorld),ee.setFromMatrixPosition(Se.matrixWorld);const ce=G.distanceTo(ee),Me=ne.projectionMatrix.elements,He=Se.projectionMatrix.elements,Ce=Me[14]/(Me[10]-1),tt=Me[14]/(Me[10]+1),nt=(Me[9]+1)/Me[5],ze=(Me[9]-1)/Me[5],L=(Me[8]-1)/Me[0],mt=(He[8]+1)/He[0],We=Ce*L,$e=Ce*mt,ge=ce/(-L+mt),ke=ge*-L;if(ne.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(ke),K.translateZ(ge),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Me[10]===-1)K.projectionMatrix.copy(ne.projectionMatrix),K.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{const xe=Ce+ge,Ne=tt+ge,ut=We-ke,C=$e+(ce-ke),v=nt*tt/Ne*xe,k=ze*tt/Ne*xe;K.projectionMatrix.makePerspective(ut,C,v,k,xe,Ne),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function fe(K,ne){ne===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(ne.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(r===null)return;let ne=K.near,Se=K.far;E.texture!==null&&(E.depthNear>0&&(ne=E.depthNear),E.depthFar>0&&(Se=E.depthFar)),g.near=R.near=w.near=ne,g.far=R.far=w.far=Se,(P!==g.near||U!==g.far)&&(r.updateRenderState({depthNear:g.near,depthFar:g.far}),P=g.near,U=g.far),w.layers.mask=K.layers.mask|2,R.layers.mask=K.layers.mask|4,g.layers.mask=w.layers.mask|R.layers.mask;const ce=K.parent,Me=g.cameras;fe(g,ce);for(let He=0;He<Me.length;He++)fe(Me[He],ce);Me.length===2?W(g,w,R):g.projectionMatrix.copy(w.projectionMatrix),ye(K,g,ce)};function ye(K,ne,Se){Se===null?K.matrix.copy(ne.matrixWorld):(K.matrix.copy(Se.matrixWorld),K.matrix.invert(),K.matrix.multiply(ne.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(ne.projectionMatrix),K.projectionMatrixInverse.copy(ne.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=vo*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return g},this.getFoveation=function(){if(!(l===null&&d===null))return c},this.setFoveation=function(K){c=K,l!==null&&(l.fixedFoveation=K),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=K)},this.hasDepthSensing=function(){return E.texture!==null},this.getDepthSensingMesh=function(){return E.getMesh(g)};let Re=null;function Oe(K,ne){if(m=ne.getViewerPose(f||a),S=ne,m!==null){const Se=m.views;d!==null&&(n.setRenderTargetFramebuffer(M,d.framebuffer),n.setRenderTarget(M));let ce=!1;Se.length!==g.cameras.length&&(g.cameras.length=0,ce=!0);for(let Ce=0;Ce<Se.length;Ce++){const tt=Se[Ce];let nt=null;if(d!==null)nt=d.getViewport(tt);else{const L=p.getViewSubImage(l,tt);nt=L.viewport,Ce===0&&(n.setRenderTargetTextures(M,L.colorTexture,L.depthStencilTexture),n.setRenderTarget(M))}let ze=_[Ce];ze===void 0&&(ze=new jn,ze.layers.enable(Ce),ze.viewport=new Et,_[Ce]=ze),ze.matrix.fromArray(tt.transform.matrix),ze.matrix.decompose(ze.position,ze.quaternion,ze.scale),ze.projectionMatrix.fromArray(tt.projectionMatrix),ze.projectionMatrixInverse.copy(ze.projectionMatrix).invert(),ze.viewport.set(nt.x,nt.y,nt.width,nt.height),Ce===0&&(g.matrix.copy(ze.matrix),g.matrix.decompose(g.position,g.quaternion,g.scale)),ce===!0&&g.cameras.push(ze)}const Me=r.enabledFeatures;if(Me&&Me.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&p){const Ce=p.getDepthInformation(Se[0]);Ce&&Ce.isValid&&Ce.texture&&E.init(n,Ce,r.renderState)}}for(let Se=0;Se<T.length;Se++){const ce=x[Se],Me=T[Se];ce!==null&&Me!==void 0&&Me.update(ce,ne,f||a)}Re&&Re(K,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),S=null}const qe=new Ha;qe.setAnimationLoop(Oe),this.setAnimationLoop=function(K){Re=K},this.dispose=function(){}}}const ln=new Ia,Tp=new ft;function xp(t,n){function e(h,u){h.matrixAutoUpdate===!0&&h.updateMatrix(),u.value.copy(h.matrix)}function i(h,u){u.color.getRGB(h.fogColor.value,Ua(t)),u.isFog?(h.fogNear.value=u.near,h.fogFar.value=u.far):u.isFogExp2&&(h.fogDensity.value=u.density)}function r(h,u,M,T,x){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(h,u):u.isMeshToonMaterial?(s(h,u),p(h,u)):u.isMeshPhongMaterial?(s(h,u),m(h,u)):u.isMeshStandardMaterial?(s(h,u),l(h,u),u.isMeshPhysicalMaterial&&d(h,u,x)):u.isMeshMatcapMaterial?(s(h,u),S(h,u)):u.isMeshDepthMaterial?s(h,u):u.isMeshDistanceMaterial?(s(h,u),E(h,u)):u.isMeshNormalMaterial?s(h,u):u.isLineBasicMaterial?(a(h,u),u.isLineDashedMaterial&&o(h,u)):u.isPointsMaterial?c(h,u,M,T):u.isSpriteMaterial?f(h,u):u.isShadowMaterial?(h.color.value.copy(u.color),h.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(h,u){h.opacity.value=u.opacity,u.color&&h.diffuse.value.copy(u.color),u.emissive&&h.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(h.map.value=u.map,e(u.map,h.mapTransform)),u.alphaMap&&(h.alphaMap.value=u.alphaMap,e(u.alphaMap,h.alphaMapTransform)),u.bumpMap&&(h.bumpMap.value=u.bumpMap,e(u.bumpMap,h.bumpMapTransform),h.bumpScale.value=u.bumpScale,u.side===xt&&(h.bumpScale.value*=-1)),u.normalMap&&(h.normalMap.value=u.normalMap,e(u.normalMap,h.normalMapTransform),h.normalScale.value.copy(u.normalScale),u.side===xt&&h.normalScale.value.negate()),u.displacementMap&&(h.displacementMap.value=u.displacementMap,e(u.displacementMap,h.displacementMapTransform),h.displacementScale.value=u.displacementScale,h.displacementBias.value=u.displacementBias),u.emissiveMap&&(h.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,h.emissiveMapTransform)),u.specularMap&&(h.specularMap.value=u.specularMap,e(u.specularMap,h.specularMapTransform)),u.alphaTest>0&&(h.alphaTest.value=u.alphaTest);const M=n.get(u),T=M.envMap,x=M.envMapRotation;T&&(h.envMap.value=T,ln.copy(x),ln.x*=-1,ln.y*=-1,ln.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(ln.y*=-1,ln.z*=-1),h.envMapRotation.value.setFromMatrix4(Tp.makeRotationFromEuler(ln)),h.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.reflectivity.value=u.reflectivity,h.ior.value=u.ior,h.refractionRatio.value=u.refractionRatio),u.lightMap&&(h.lightMap.value=u.lightMap,h.lightMapIntensity.value=u.lightMapIntensity,e(u.lightMap,h.lightMapTransform)),u.aoMap&&(h.aoMap.value=u.aoMap,h.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,h.aoMapTransform))}function a(h,u){h.diffuse.value.copy(u.color),h.opacity.value=u.opacity,u.map&&(h.map.value=u.map,e(u.map,h.mapTransform))}function o(h,u){h.dashSize.value=u.dashSize,h.totalSize.value=u.dashSize+u.gapSize,h.scale.value=u.scale}function c(h,u,M,T){h.diffuse.value.copy(u.color),h.opacity.value=u.opacity,h.size.value=u.size*M,h.scale.value=T*.5,u.map&&(h.map.value=u.map,e(u.map,h.uvTransform)),u.alphaMap&&(h.alphaMap.value=u.alphaMap,e(u.alphaMap,h.alphaMapTransform)),u.alphaTest>0&&(h.alphaTest.value=u.alphaTest)}function f(h,u){h.diffuse.value.copy(u.color),h.opacity.value=u.opacity,h.rotation.value=u.rotation,u.map&&(h.map.value=u.map,e(u.map,h.mapTransform)),u.alphaMap&&(h.alphaMap.value=u.alphaMap,e(u.alphaMap,h.alphaMapTransform)),u.alphaTest>0&&(h.alphaTest.value=u.alphaTest)}function m(h,u){h.specular.value.copy(u.specular),h.shininess.value=Math.max(u.shininess,1e-4)}function p(h,u){u.gradientMap&&(h.gradientMap.value=u.gradientMap)}function l(h,u){h.metalness.value=u.metalness,u.metalnessMap&&(h.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,h.metalnessMapTransform)),h.roughness.value=u.roughness,u.roughnessMap&&(h.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,h.roughnessMapTransform)),u.envMap&&(h.envMapIntensity.value=u.envMapIntensity)}function d(h,u,M){h.ior.value=u.ior,u.sheen>0&&(h.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),h.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(h.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,h.sheenColorMapTransform)),u.sheenRoughnessMap&&(h.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,h.sheenRoughnessMapTransform))),u.clearcoat>0&&(h.clearcoat.value=u.clearcoat,h.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(h.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,h.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(h.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,h.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(h.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,h.clearcoatNormalMapTransform),h.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===xt&&h.clearcoatNormalScale.value.negate())),u.dispersion>0&&(h.dispersion.value=u.dispersion),u.iridescence>0&&(h.iridescence.value=u.iridescence,h.iridescenceIOR.value=u.iridescenceIOR,h.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],h.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(h.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,h.iridescenceMapTransform)),u.iridescenceThicknessMap&&(h.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,h.iridescenceThicknessMapTransform))),u.transmission>0&&(h.transmission.value=u.transmission,h.transmissionSamplerMap.value=M.texture,h.transmissionSamplerSize.value.set(M.width,M.height),u.transmissionMap&&(h.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,h.transmissionMapTransform)),h.thickness.value=u.thickness,u.thicknessMap&&(h.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,h.thicknessMapTransform)),h.attenuationDistance.value=u.attenuationDistance,h.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(h.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(h.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,h.anisotropyMapTransform))),h.specularIntensity.value=u.specularIntensity,h.specularColor.value.copy(u.specularColor),u.specularColorMap&&(h.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,h.specularColorMapTransform)),u.specularIntensityMap&&(h.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,h.specularIntensityMapTransform))}function S(h,u){u.matcap&&(h.matcap.value=u.matcap)}function E(h,u){const M=n.get(u).light;h.referencePosition.value.setFromMatrixPosition(M.matrixWorld),h.nearDistance.value=M.shadow.camera.near,h.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Ap(t,n,e,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,T){const x=T.program;i.uniformBlockBinding(M,x)}function f(M,T){let x=r[M.id];x===void 0&&(S(M),x=m(M),r[M.id]=x,M.addEventListener("dispose",h));const b=T.program;i.updateUBOMapping(M,b);const A=n.render.frame;s[M.id]!==A&&(l(M),s[M.id]=A)}function m(M){const T=p();M.__bindingPointIndex=T;const x=t.createBuffer(),b=M.__size,A=M.usage;return t.bindBuffer(t.UNIFORM_BUFFER,x),t.bufferData(t.UNIFORM_BUFFER,b,A),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,T,x),x}function p(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function l(M){const T=r[M.id],x=M.uniforms,b=M.__cache;t.bindBuffer(t.UNIFORM_BUFFER,T);for(let A=0,w=x.length;A<w;A++){const R=Array.isArray(x[A])?x[A]:[x[A]];for(let _=0,g=R.length;_<g;_++){const P=R[_];if(d(P,A,_,b)===!0){const U=P.__offset,I=Array.isArray(P.value)?P.value:[P.value];let B=0;for(let X=0;X<I.length;X++){const G=I[X],ee=E(G);typeof G=="number"||typeof G=="boolean"?(P.__data[0]=G,t.bufferSubData(t.UNIFORM_BUFFER,U+B,P.__data)):G.isMatrix3?(P.__data[0]=G.elements[0],P.__data[1]=G.elements[1],P.__data[2]=G.elements[2],P.__data[3]=0,P.__data[4]=G.elements[3],P.__data[5]=G.elements[4],P.__data[6]=G.elements[5],P.__data[7]=0,P.__data[8]=G.elements[6],P.__data[9]=G.elements[7],P.__data[10]=G.elements[8],P.__data[11]=0):(G.toArray(P.__data,B),B+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,U,P.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function d(M,T,x,b){const A=M.value,w=T+"_"+x;if(b[w]===void 0)return typeof A=="number"||typeof A=="boolean"?b[w]=A:b[w]=A.clone(),!0;{const R=b[w];if(typeof A=="number"||typeof A=="boolean"){if(R!==A)return b[w]=A,!0}else if(R.equals(A)===!1)return R.copy(A),!0}return!1}function S(M){const T=M.uniforms;let x=0;const b=16;for(let w=0,R=T.length;w<R;w++){const _=Array.isArray(T[w])?T[w]:[T[w]];for(let g=0,P=_.length;g<P;g++){const U=_[g],I=Array.isArray(U.value)?U.value:[U.value];for(let B=0,X=I.length;B<X;B++){const G=I[B],ee=E(G),W=x%b,fe=W%ee.boundary,ye=W+fe;x+=fe,ye!==0&&b-ye<ee.storage&&(x+=b-ye),U.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=x,x+=ee.storage}}}const A=x%b;return A>0&&(x+=b-A),M.__size=x,M.__cache={},this}function E(M){const T={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(T.boundary=4,T.storage=4):M.isVector2?(T.boundary=8,T.storage=8):M.isVector3||M.isColor?(T.boundary=16,T.storage=12):M.isVector4?(T.boundary=16,T.storage=16):M.isMatrix3?(T.boundary=48,T.storage=48):M.isMatrix4?(T.boundary=64,T.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),T}function h(M){const T=M.target;T.removeEventListener("dispose",h);const x=a.indexOf(T.__bindingPointIndex);a.splice(x,1),t.deleteBuffer(r[T.id]),delete r[T.id],delete s[T.id]}function u(){for(const M in r)t.deleteBuffer(r[M]);a=[],r={},s={}}return{bind:c,update:f,dispose:u}}class yp{constructor(n={}){const{canvas:e=co(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:f=!1,powerPreference:m="default",failIfMajorPerformanceCaveat:p=!1,reverseDepthBuffer:l=!1}=n;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=a;const S=new Uint32Array(4),E=new Int32Array(4);let h=null,u=null;const M=[],T=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=nn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const x=this;let b=!1;this._outputColorSpace=lo;let A=0,w=0,R=null,_=-1,g=null;const P=new Et,U=new Et;let I=null;const B=new Pe(0);let X=0,G=e.width,ee=e.height,W=1,fe=null,ye=null;const Re=new Et(0,0,G,ee),Oe=new Et(0,0,G,ee);let qe=!1;const K=new Sa;let ne=!1,Se=!1;const ce=new ft,Me=new ft,He=new z,Ce=new Et,tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nt=!1;function ze(){return R===null?W:1}let L=i;function mt(y,F){return e.getContext(y,F)}try{const y={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:f,powerPreference:m,failIfMajorPerformanceCaveat:p};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${uo}`),e.addEventListener("webglcontextlost",de,!1),e.addEventListener("webglcontextrestored",J,!1),e.addEventListener("webglcontextcreationerror",$,!1),L===null){const F="webgl2";if(L=mt(F,y),L===null)throw mt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let We,$e,ge,ke,xe,Ne,ut,C,v,k,Y,Q,q,_e,se,me,ve,Z,le,we,be,ie,Ie,D;function ae(){We=new Nf(L),We.init(),ie=new _p(L,We),$e=new Rf(L,We,n,ie),ge=new mp(L,We),$e.reverseDepthBuffer&&l&&ge.buffers.depth.setReversed(!0),ke=new Bf(L),xe=new np,Ne=new gp(L,We,ge,xe,$e,ie,ke),ut=new Pf(x),C=new Df(x),v=new zc(L),Ie=new bf(L,v),k=new Ff(L,v,ke,Ie),Y=new Gf(L,k,v,ke),le=new kf(L,$e,Ne),me=new Cf(xe),Q=new tp(x,ut,C,We,$e,Ie,me),q=new xp(x,xe),_e=new rp,se=new up(We),Z=new yf(x,ut,C,ge,Y,d,c),ve=new pp(x,Y,$e),D=new Ap(L,ke,$e,ge),we=new wf(L,We,ke),be=new Of(L,We,ke),ke.programs=Q.programs,x.capabilities=$e,x.extensions=We,x.properties=xe,x.renderLists=_e,x.shadowMap=ve,x.state=ge,x.info=ke}ae();const j=new Ep(x,L);this.xr=j,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const y=We.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=We.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(y){y!==void 0&&(W=y,this.setSize(G,ee,!1))},this.getSize=function(y){return y.set(G,ee)},this.setSize=function(y,F,V=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=y,ee=F,e.width=Math.floor(y*W),e.height=Math.floor(F*W),V===!0&&(e.style.width=y+"px",e.style.height=F+"px"),this.setViewport(0,0,y,F)},this.getDrawingBufferSize=function(y){return y.set(G*W,ee*W).floor()},this.setDrawingBufferSize=function(y,F,V){G=y,ee=F,W=V,e.width=Math.floor(y*V),e.height=Math.floor(F*V),this.setViewport(0,0,y,F)},this.getCurrentViewport=function(y){return y.copy(P)},this.getViewport=function(y){return y.copy(Re)},this.setViewport=function(y,F,V,H){y.isVector4?Re.set(y.x,y.y,y.z,y.w):Re.set(y,F,V,H),ge.viewport(P.copy(Re).multiplyScalar(W).round())},this.getScissor=function(y){return y.copy(Oe)},this.setScissor=function(y,F,V,H){y.isVector4?Oe.set(y.x,y.y,y.z,y.w):Oe.set(y,F,V,H),ge.scissor(U.copy(Oe).multiplyScalar(W).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(y){ge.setScissorTest(qe=y)},this.setOpaqueSort=function(y){fe=y},this.setTransparentSort=function(y){ye=y},this.getClearColor=function(y){return y.copy(Z.getClearColor())},this.setClearColor=function(){Z.setClearColor(...arguments)},this.getClearAlpha=function(){return Z.getClearAlpha()},this.setClearAlpha=function(){Z.setClearAlpha(...arguments)},this.clear=function(y=!0,F=!0,V=!0){let H=0;if(y){let O=!1;if(R!==null){const te=R.texture.format;O=te===Ca||te===Ra||te===wa}if(O){const te=R.texture.type,oe=te===hn||te===ii||te===Ii||te===ni||te===xa||te===Aa,he=Z.getClearColor(),ue=Z.getClearAlpha(),Ue=he.r,Le=he.g,Te=he.b;oe?(S[0]=Ue,S[1]=Le,S[2]=Te,S[3]=ue,L.clearBufferuiv(L.COLOR,0,S)):(E[0]=Ue,E[1]=Le,E[2]=Te,E[3]=ue,L.clearBufferiv(L.COLOR,0,E))}else H|=L.COLOR_BUFFER_BIT}F&&(H|=L.DEPTH_BUFFER_BIT),V&&(H|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",de,!1),e.removeEventListener("webglcontextrestored",J,!1),e.removeEventListener("webglcontextcreationerror",$,!1),Z.dispose(),_e.dispose(),se.dispose(),xe.dispose(),ut.dispose(),C.dispose(),Y.dispose(),Ie.dispose(),D.dispose(),Q.dispose(),j.dispose(),j.removeEventListener("sessionstart",Wr),j.removeEventListener("sessionend",Xr),an.stop()};function de(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function J(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const y=ke.autoReset,F=ve.enabled,V=ve.autoUpdate,H=ve.needsUpdate,O=ve.type;ae(),ke.autoReset=y,ve.enabled=F,ve.autoUpdate=V,ve.needsUpdate=H,ve.type=O}function $(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function pe(y){const F=y.target;F.removeEventListener("dispose",pe),De(F)}function De(y){Qe(y),xe.remove(y)}function Qe(y){const F=xe.get(y).programs;F!==void 0&&(F.forEach(function(V){Q.releaseProgram(V)}),y.isShaderMaterial&&Q.releaseShaderCache(y))}this.renderBufferDirect=function(y,F,V,H,O,te){F===null&&(F=tt);const oe=O.isMesh&&O.matrixWorld.determinant()<0,he=eo(y,F,V,H,O);ge.setMaterial(H,oe);let ue=V.index,Ue=1;if(H.wireframe===!0){if(ue=k.getWireframeAttribute(V),ue===void 0)return;Ue=2}const Le=V.drawRange,Te=V.attributes.position;let Be=Le.start*Ue,Ye=(Le.start+Le.count)*Ue;te!==null&&(Be=Math.max(Be,te.start*Ue),Ye=Math.min(Ye,(te.start+te.count)*Ue)),ue!==null?(Be=Math.max(Be,0),Ye=Math.min(Ye,ue.count)):Te!=null&&(Be=Math.max(Be,0),Ye=Math.min(Ye,Te.count));const rt=Ye-Be;if(rt<0||rt===1/0)return;Ie.setup(O,H,he,V,ue);let Ze,Ke=we;if(ue!==null&&(Ze=v.get(ue),Ke=be,Ke.setIndex(Ze)),O.isMesh)H.wireframe===!0?(ge.setLineWidth(H.wireframeLinewidth*ze()),Ke.setMode(L.LINES)):Ke.setMode(L.TRIANGLES);else if(O.isLine){let Ae=H.linewidth;Ae===void 0&&(Ae=1),ge.setLineWidth(Ae*ze()),O.isLineSegments?Ke.setMode(L.LINES):O.isLineLoop?Ke.setMode(L.LINE_LOOP):Ke.setMode(L.LINE_STRIP)}else O.isPoints?Ke.setMode(L.POINTS):O.isSprite&&Ke.setMode(L.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)wi("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ke.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(We.get("WEBGL_multi_draw"))Ke.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const Ae=O._multiDrawStarts,it=O._multiDrawCounts,Ge=O._multiDrawCount,At=ue?v.get(ue).bytesPerElement:1,_n=xe.get(H).currentProgram.getUniforms();for(let yt=0;yt<Ge;yt++)_n.setValue(L,"_gl_DrawID",yt),Ke.render(Ae[yt]/At,it[yt])}else if(O.isInstancedMesh)Ke.renderInstances(Be,rt,O.count);else if(V.isInstancedBufferGeometry){const Ae=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,it=Math.min(V.instanceCount,Ae);Ke.renderInstances(Be,rt,it)}else Ke.render(Be,rt)};function Xe(y,F,V){y.transparent===!0&&y.side===Lt&&y.forceSinglePass===!1?(y.side=xt,y.needsUpdate=!0,ai(y,F,V),y.side=mn,y.needsUpdate=!0,ai(y,F,V),y.side=Lt):ai(y,F,V)}this.compile=function(y,F,V=null){V===null&&(V=y),u=se.get(V),u.init(F),T.push(u),V.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(u.pushLight(O),O.castShadow&&u.pushShadow(O))}),y!==V&&y.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(u.pushLight(O),O.castShadow&&u.pushShadow(O))}),u.setupLights();const H=new Set;return y.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const te=O.material;if(te)if(Array.isArray(te))for(let oe=0;oe<te.length;oe++){const he=te[oe];Xe(he,V,O),H.add(he)}else Xe(te,V,O),H.add(te)}),u=T.pop(),H},this.compileAsync=function(y,F,V=null){const H=this.compile(y,F,V);return new Promise(O=>{function te(){if(H.forEach(function(oe){xe.get(oe).currentProgram.isReady()&&H.delete(oe)}),H.size===0){O(y);return}setTimeout(te,10)}We.get("KHR_parallel_shader_compile")!==null?te():setTimeout(te,10)})};let Ot=null;function Wt(y){Ot&&Ot(y)}function Wr(){an.stop()}function Xr(){an.start()}const an=new Ha;an.setAnimationLoop(Wt),typeof self<"u"&&an.setContext(self),this.setAnimationLoop=function(y){Ot=y,j.setAnimationLoop(y),y===null?an.stop():an.start()},j.addEventListener("sessionstart",Wr),j.addEventListener("sessionend",Xr),this.render=function(y,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(F),F=j.getCamera()),y.isScene===!0&&y.onBeforeRender(x,y,F,R),u=se.get(y,T.length),u.init(F),T.push(u),Me.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),K.setFromProjectionMatrix(Me),Se=this.localClippingEnabled,ne=me.init(this.clippingPlanes,Se),h=_e.get(y,M.length),h.init(),M.push(h),j.enabled===!0&&j.isPresenting===!0){const te=x.xr.getDepthSensingMesh();te!==null&&zi(te,F,-1/0,x.sortObjects)}zi(y,F,0,x.sortObjects),h.finish(),x.sortObjects===!0&&h.sort(fe,ye),nt=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,nt&&Z.addToRenderList(h,y),this.info.render.frame++,ne===!0&&me.beginShadows();const V=u.state.shadowsArray;ve.render(V,y,F),ne===!0&&me.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=h.opaque,O=h.transmissive;if(u.setupLights(),F.isArrayCamera){const te=F.cameras;if(O.length>0)for(let oe=0,he=te.length;oe<he;oe++){const ue=te[oe];Yr(H,O,y,ue)}nt&&Z.render(y);for(let oe=0,he=te.length;oe<he;oe++){const ue=te[oe];qr(h,y,ue,ue.viewport)}}else O.length>0&&Yr(H,O,y,F),nt&&Z.render(y),qr(h,y,F);R!==null&&w===0&&(Ne.updateMultisampleRenderTarget(R),Ne.updateRenderTargetMipmap(R)),y.isScene===!0&&y.onAfterRender(x,y,F),Ie.resetDefaultState(),_=-1,g=null,T.pop(),T.length>0?(u=T[T.length-1],ne===!0&&me.setGlobalState(x.clippingPlanes,u.state.camera)):u=null,M.pop(),M.length>0?h=M[M.length-1]:h=null};function zi(y,F,V,H){if(y.visible===!1)return;if(y.layers.test(F.layers)){if(y.isGroup)V=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(F);else if(y.isLight)u.pushLight(y),y.castShadow&&u.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||K.intersectsSprite(y)){H&&Ce.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Me);const oe=Y.update(y),he=y.material;he.visible&&h.push(y,oe,he,V,Ce.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||K.intersectsObject(y))){const oe=Y.update(y),he=y.material;if(H&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ce.copy(y.boundingSphere.center)):(oe.boundingSphere===null&&oe.computeBoundingSphere(),Ce.copy(oe.boundingSphere.center)),Ce.applyMatrix4(y.matrixWorld).applyMatrix4(Me)),Array.isArray(he)){const ue=oe.groups;for(let Ue=0,Le=ue.length;Ue<Le;Ue++){const Te=ue[Ue],Be=he[Te.materialIndex];Be&&Be.visible&&h.push(y,oe,Be,V,Ce.z,Te)}}else he.visible&&h.push(y,oe,he,V,Ce.z,null)}}const te=y.children;for(let oe=0,he=te.length;oe<he;oe++)zi(te[oe],F,V,H)}function qr(y,F,V,H){const O=y.opaque,te=y.transmissive,oe=y.transparent;u.setupLightsView(V),ne===!0&&me.setGlobalState(x.clippingPlanes,V),H&&ge.viewport(P.copy(H)),O.length>0&&si(O,F,V),te.length>0&&si(te,F,V),oe.length>0&&si(oe,F,V),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function Yr(y,F,V,H){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[H.id]===void 0&&(u.state.transmissionRenderTarget[H.id]=new kt(1,1,{generateMipmaps:!0,type:We.has("EXT_color_buffer_half_float")||We.has("EXT_color_buffer_float")?Oi:hn,minFilter:Yn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ot.workingColorSpace}));const te=u.state.transmissionRenderTarget[H.id],oe=H.viewport||P;te.setSize(oe.z*x.transmissionResolutionScale,oe.w*x.transmissionResolutionScale);const he=x.getRenderTarget(),ue=x.getActiveCubeFace(),Ue=x.getActiveMipmapLevel();x.setRenderTarget(te),x.getClearColor(B),X=x.getClearAlpha(),X<1&&x.setClearColor(16777215,.5),x.clear(),nt&&Z.render(V);const Le=x.toneMapping;x.toneMapping=nn;const Te=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),u.setupLightsView(H),ne===!0&&me.setGlobalState(x.clippingPlanes,H),si(y,V,H),Ne.updateMultisampleRenderTarget(te),Ne.updateRenderTargetMipmap(te),We.has("WEBGL_multisampled_render_to_texture")===!1){let Be=!1;for(let Ye=0,rt=F.length;Ye<rt;Ye++){const Ze=F[Ye],Ke=Ze.object,Ae=Ze.geometry,it=Ze.material,Ge=Ze.group;if(it.side===Lt&&Ke.layers.test(H.layers)){const At=it.side;it.side=xt,it.needsUpdate=!0,Kr(Ke,V,H,Ae,it,Ge),it.side=At,it.needsUpdate=!0,Be=!0}}Be===!0&&(Ne.updateMultisampleRenderTarget(te),Ne.updateRenderTargetMipmap(te))}x.setRenderTarget(he,ue,Ue),x.setClearColor(B,X),Te!==void 0&&(H.viewport=Te),x.toneMapping=Le}function si(y,F,V){const H=F.isScene===!0?F.overrideMaterial:null;for(let O=0,te=y.length;O<te;O++){const oe=y[O],he=oe.object,ue=oe.geometry,Ue=oe.group;let Le=oe.material;Le.allowOverride===!0&&H!==null&&(Le=H),he.layers.test(V.layers)&&Kr(he,F,V,ue,Le,Ue)}}function Kr(y,F,V,H,O,te){y.onBeforeRender(x,F,V,H,O,te),y.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),O.onBeforeRender(x,F,V,H,y,te),O.transparent===!0&&O.side===Lt&&O.forceSinglePass===!1?(O.side=xt,O.needsUpdate=!0,x.renderBufferDirect(V,F,H,O,y,te),O.side=mn,O.needsUpdate=!0,x.renderBufferDirect(V,F,H,O,y,te),O.side=Lt):x.renderBufferDirect(V,F,H,O,y,te),y.onAfterRender(x,F,V,H,O,te)}function ai(y,F,V){F.isScene!==!0&&(F=tt);const H=xe.get(y),O=u.state.lights,te=u.state.shadowsArray,oe=O.state.version,he=Q.getParameters(y,O.state,te,F,V),ue=Q.getProgramCacheKey(he);let Ue=H.programs;H.environment=y.isMeshStandardMaterial?F.environment:null,H.fog=F.fog,H.envMap=(y.isMeshStandardMaterial?C:ut).get(y.envMap||H.environment),H.envMapRotation=H.environment!==null&&y.envMap===null?F.environmentRotation:y.envMapRotation,Ue===void 0&&(y.addEventListener("dispose",pe),Ue=new Map,H.programs=Ue);let Le=Ue.get(ue);if(Le!==void 0){if(H.currentProgram===Le&&H.lightsStateVersion===oe)return Qr(y,he),Le}else he.uniforms=Q.getUniforms(y),y.onBeforeCompile(he,x),Le=Q.acquireProgram(he,ue),Ue.set(ue,Le),H.uniforms=he.uniforms;const Te=H.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Te.clippingPlanes=me.uniform),Qr(y,he),H.needsLights=no(y),H.lightsStateVersion=oe,H.needsLights&&(Te.ambientLightColor.value=O.state.ambient,Te.lightProbe.value=O.state.probe,Te.directionalLights.value=O.state.directional,Te.directionalLightShadows.value=O.state.directionalShadow,Te.spotLights.value=O.state.spot,Te.spotLightShadows.value=O.state.spotShadow,Te.rectAreaLights.value=O.state.rectArea,Te.ltc_1.value=O.state.rectAreaLTC1,Te.ltc_2.value=O.state.rectAreaLTC2,Te.pointLights.value=O.state.point,Te.pointLightShadows.value=O.state.pointShadow,Te.hemisphereLights.value=O.state.hemi,Te.directionalShadowMap.value=O.state.directionalShadowMap,Te.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Te.spotShadowMap.value=O.state.spotShadowMap,Te.spotLightMatrix.value=O.state.spotLightMatrix,Te.spotLightMap.value=O.state.spotLightMap,Te.pointShadowMap.value=O.state.pointShadowMap,Te.pointShadowMatrix.value=O.state.pointShadowMatrix),H.currentProgram=Le,H.uniformsList=null,Le}function $r(y){if(y.uniformsList===null){const F=y.currentProgram.getUniforms();y.uniformsList=Ci.seqWithValue(F.seq,y.uniforms)}return y.uniformsList}function Qr(y,F){const V=xe.get(y);V.outputColorSpace=F.outputColorSpace,V.batching=F.batching,V.batchingColor=F.batchingColor,V.instancing=F.instancing,V.instancingColor=F.instancingColor,V.instancingMorph=F.instancingMorph,V.skinning=F.skinning,V.morphTargets=F.morphTargets,V.morphNormals=F.morphNormals,V.morphColors=F.morphColors,V.morphTargetsCount=F.morphTargetsCount,V.numClippingPlanes=F.numClippingPlanes,V.numIntersection=F.numClipIntersection,V.vertexAlphas=F.vertexAlphas,V.vertexTangents=F.vertexTangents,V.toneMapping=F.toneMapping}function eo(y,F,V,H,O){F.isScene!==!0&&(F=tt),Ne.resetTextureUnits();const te=F.fog,oe=H.isMeshStandardMaterial?F.environment:null,he=R===null?x.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Bi,ue=(H.isMeshStandardMaterial?C:ut).get(H.envMap||oe),Ue=H.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Le=!!V.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Te=!!V.morphAttributes.position,Be=!!V.morphAttributes.normal,Ye=!!V.morphAttributes.color;let rt=nn;H.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(rt=x.toneMapping);const Ze=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Ke=Ze!==void 0?Ze.length:0,Ae=xe.get(H),it=u.state.lights;if(ne===!0&&(Se===!0||y!==g)){const gt=y===g&&H.id===_;me.setState(H,y,gt)}let Ge=!1;H.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==it.state.version||Ae.outputColorSpace!==he||O.isBatchedMesh&&Ae.batching===!1||!O.isBatchedMesh&&Ae.batching===!0||O.isBatchedMesh&&Ae.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ae.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ae.instancing===!1||!O.isInstancedMesh&&Ae.instancing===!0||O.isSkinnedMesh&&Ae.skinning===!1||!O.isSkinnedMesh&&Ae.skinning===!0||O.isInstancedMesh&&Ae.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ae.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ae.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ae.instancingMorph===!1&&O.morphTexture!==null||Ae.envMap!==ue||H.fog===!0&&Ae.fog!==te||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==me.numPlanes||Ae.numIntersection!==me.numIntersection)||Ae.vertexAlphas!==Ue||Ae.vertexTangents!==Le||Ae.morphTargets!==Te||Ae.morphNormals!==Be||Ae.morphColors!==Ye||Ae.toneMapping!==rt||Ae.morphTargetsCount!==Ke)&&(Ge=!0):(Ge=!0,Ae.__version=H.version);let At=Ae.currentProgram;Ge===!0&&(At=ai(H,F,O));let _n=!1,yt=!1,On=!1;const et=At.getUniforms(),Pt=Ae.uniforms;if(ge.useProgram(At.program)&&(_n=!0,yt=!0,On=!0),H.id!==_&&(_=H.id,yt=!0),_n||g!==y){ge.buffers.depth.getReversed()?(ce.copy(y.projectionMatrix),fo(ce),po(ce),et.setValue(L,"projectionMatrix",ce)):et.setValue(L,"projectionMatrix",y.projectionMatrix),et.setValue(L,"viewMatrix",y.matrixWorldInverse);const St=et.map.cameraPosition;St!==void 0&&St.setValue(L,He.setFromMatrixPosition(y.matrixWorld)),$e.logarithmicDepthBuffer&&et.setValue(L,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&et.setValue(L,"isOrthographic",y.isOrthographicCamera===!0),g!==y&&(g=y,yt=!0,On=!0)}if(O.isSkinnedMesh){et.setOptional(L,O,"bindMatrix"),et.setOptional(L,O,"bindMatrixInverse");const gt=O.skeleton;gt&&(gt.boneTexture===null&&gt.computeBoneTexture(),et.setValue(L,"boneTexture",gt.boneTexture,Ne))}O.isBatchedMesh&&(et.setOptional(L,O,"batchingTexture"),et.setValue(L,"batchingTexture",O._matricesTexture,Ne),et.setOptional(L,O,"batchingIdTexture"),et.setValue(L,"batchingIdTexture",O._indirectTexture,Ne),et.setOptional(L,O,"batchingColorTexture"),O._colorsTexture!==null&&et.setValue(L,"batchingColorTexture",O._colorsTexture,Ne));const Ut=V.morphAttributes;if((Ut.position!==void 0||Ut.normal!==void 0||Ut.color!==void 0)&&le.update(O,V,At),(yt||Ae.receiveShadow!==O.receiveShadow)&&(Ae.receiveShadow=O.receiveShadow,et.setValue(L,"receiveShadow",O.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Pt.envMap.value=ue,Pt.flipEnvMap.value=ue.isCubeTexture&&ue.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&F.environment!==null&&(Pt.envMapIntensity.value=F.environmentIntensity),yt&&(et.setValue(L,"toneMappingExposure",x.toneMappingExposure),Ae.needsLights&&to(Pt,On),te&&H.fog===!0&&q.refreshFogUniforms(Pt,te),q.refreshMaterialUniforms(Pt,H,W,ee,u.state.transmissionRenderTarget[y.id]),Ci.upload(L,$r(Ae),Pt,Ne)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Ci.upload(L,$r(Ae),Pt,Ne),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&et.setValue(L,"center",O.center),et.setValue(L,"modelViewMatrix",O.modelViewMatrix),et.setValue(L,"normalMatrix",O.normalMatrix),et.setValue(L,"modelMatrix",O.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const gt=H.uniformsGroups;for(let St=0,Wi=gt.length;St<Wi;St++){const on=gt[St];D.update(on,At),D.bind(on,At)}}return At}function to(y,F){y.ambientLightColor.needsUpdate=F,y.lightProbe.needsUpdate=F,y.directionalLights.needsUpdate=F,y.directionalLightShadows.needsUpdate=F,y.pointLights.needsUpdate=F,y.pointLightShadows.needsUpdate=F,y.spotLights.needsUpdate=F,y.spotLightShadows.needsUpdate=F,y.rectAreaLights.needsUpdate=F,y.hemisphereLights.needsUpdate=F}function no(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(y,F,V){const H=xe.get(y);H.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),xe.get(y.texture).__webglTexture=F,xe.get(y.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:V,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,F){const V=xe.get(y);V.__webglFramebuffer=F,V.__useDefaultFramebuffer=F===void 0};const io=L.createFramebuffer();this.setRenderTarget=function(y,F=0,V=0){R=y,A=F,w=V;let H=!0,O=null,te=!1,oe=!1;if(y){const ue=xe.get(y);if(ue.__useDefaultFramebuffer!==void 0)ge.bindFramebuffer(L.FRAMEBUFFER,null),H=!1;else if(ue.__webglFramebuffer===void 0)Ne.setupRenderTarget(y);else if(ue.__hasExternalTextures)Ne.rebindTextures(y,xe.get(y.texture).__webglTexture,xe.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Te=y.depthTexture;if(ue.__boundDepthTexture!==Te){if(Te!==null&&xe.has(Te)&&(y.width!==Te.image.width||y.height!==Te.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ne.setupDepthRenderbuffer(y)}}const Ue=y.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(oe=!0);const Le=xe.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Le[F])?O=Le[F][V]:O=Le[F],te=!0):y.samples>0&&Ne.useMultisampledRTT(y)===!1?O=xe.get(y).__webglMultisampledFramebuffer:Array.isArray(Le)?O=Le[V]:O=Le,P.copy(y.viewport),U.copy(y.scissor),I=y.scissorTest}else P.copy(Re).multiplyScalar(W).floor(),U.copy(Oe).multiplyScalar(W).floor(),I=qe;if(V!==0&&(O=io),ge.bindFramebuffer(L.FRAMEBUFFER,O)&&H&&ge.drawBuffers(y,O),ge.viewport(P),ge.scissor(U),ge.setScissorTest(I),te){const ue=xe.get(y.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+F,ue.__webglTexture,V)}else if(oe){const ue=xe.get(y.texture),Ue=F;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,ue.__webglTexture,V,Ue)}else if(y!==null&&V!==0){const ue=xe.get(y.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,ue.__webglTexture,V)}_=-1},this.readRenderTargetPixels=function(y,F,V,H,O,te,oe,he=0){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ue=xe.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&oe!==void 0&&(ue=ue[oe]),ue){ge.bindFramebuffer(L.FRAMEBUFFER,ue);try{const Ue=y.textures[he],Le=Ue.format,Te=Ue.type;if(!$e.textureFormatReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$e.textureTypeReadable(Te)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=y.width-H&&V>=0&&V<=y.height-O&&(y.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+he),L.readPixels(F,V,H,O,ie.convert(Le),ie.convert(Te),te))}finally{const Ue=R!==null?xe.get(R).__webglFramebuffer:null;ge.bindFramebuffer(L.FRAMEBUFFER,Ue)}}},this.readRenderTargetPixelsAsync=async function(y,F,V,H,O,te,oe,he=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ue=xe.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&oe!==void 0&&(ue=ue[oe]),ue)if(F>=0&&F<=y.width-H&&V>=0&&V<=y.height-O){ge.bindFramebuffer(L.FRAMEBUFFER,ue);const Ue=y.textures[he],Le=Ue.format,Te=Ue.type;if(!$e.textureFormatReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$e.textureTypeReadable(Te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Be=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Be),L.bufferData(L.PIXEL_PACK_BUFFER,te.byteLength,L.STREAM_READ),y.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+he),L.readPixels(F,V,H,O,ie.convert(Le),ie.convert(Te),0);const Ye=R!==null?xe.get(R).__webglFramebuffer:null;ge.bindFramebuffer(L.FRAMEBUFFER,Ye);const rt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await ho(L,rt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Be),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,te),L.deleteBuffer(Be),L.deleteSync(rt),te}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,F=null,V=0){const H=Math.pow(2,-V),O=Math.floor(y.image.width*H),te=Math.floor(y.image.height*H),oe=F!==null?F.x:0,he=F!==null?F.y:0;Ne.setTexture2D(y,0),L.copyTexSubImage2D(L.TEXTURE_2D,V,0,0,oe,he,O,te),ge.unbindTexture()};const ro=L.createFramebuffer(),so=L.createFramebuffer();this.copyTextureToTexture=function(y,F,V=null,H=null,O=0,te=null){te===null&&(O!==0?(wi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),te=O,O=0):te=0);let oe,he,ue,Ue,Le,Te,Be,Ye,rt;const Ze=y.isCompressedTexture?y.mipmaps[te]:y.image;if(V!==null)oe=V.max.x-V.min.x,he=V.max.y-V.min.y,ue=V.isBox3?V.max.z-V.min.z:1,Ue=V.min.x,Le=V.min.y,Te=V.isBox3?V.min.z:0;else{const Ut=Math.pow(2,-O);oe=Math.floor(Ze.width*Ut),he=Math.floor(Ze.height*Ut),y.isDataArrayTexture?ue=Ze.depth:y.isData3DTexture?ue=Math.floor(Ze.depth*Ut):ue=1,Ue=0,Le=0,Te=0}H!==null?(Be=H.x,Ye=H.y,rt=H.z):(Be=0,Ye=0,rt=0);const Ke=ie.convert(F.format),Ae=ie.convert(F.type);let it;F.isData3DTexture?(Ne.setTexture3D(F,0),it=L.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(Ne.setTexture2DArray(F,0),it=L.TEXTURE_2D_ARRAY):(Ne.setTexture2D(F,0),it=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,F.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,F.unpackAlignment);const Ge=L.getParameter(L.UNPACK_ROW_LENGTH),At=L.getParameter(L.UNPACK_IMAGE_HEIGHT),_n=L.getParameter(L.UNPACK_SKIP_PIXELS),yt=L.getParameter(L.UNPACK_SKIP_ROWS),On=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,Ze.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Ze.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ue),L.pixelStorei(L.UNPACK_SKIP_ROWS,Le),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Te);const et=y.isDataArrayTexture||y.isData3DTexture,Pt=F.isDataArrayTexture||F.isData3DTexture;if(y.isDepthTexture){const Ut=xe.get(y),gt=xe.get(F),St=xe.get(Ut.__renderTarget),Wi=xe.get(gt.__renderTarget);ge.bindFramebuffer(L.READ_FRAMEBUFFER,St.__webglFramebuffer),ge.bindFramebuffer(L.DRAW_FRAMEBUFFER,Wi.__webglFramebuffer);for(let on=0;on<ue;on++)et&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,xe.get(y).__webglTexture,O,Te+on),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,xe.get(F).__webglTexture,te,rt+on)),L.blitFramebuffer(Ue,Le,oe,he,Be,Ye,oe,he,L.DEPTH_BUFFER_BIT,L.NEAREST);ge.bindFramebuffer(L.READ_FRAMEBUFFER,null),ge.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(O!==0||y.isRenderTargetTexture||xe.has(y)){const Ut=xe.get(y),gt=xe.get(F);ge.bindFramebuffer(L.READ_FRAMEBUFFER,ro),ge.bindFramebuffer(L.DRAW_FRAMEBUFFER,so);for(let St=0;St<ue;St++)et?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ut.__webglTexture,O,Te+St):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Ut.__webglTexture,O),Pt?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,gt.__webglTexture,te,rt+St):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,gt.__webglTexture,te),O!==0?L.blitFramebuffer(Ue,Le,oe,he,Be,Ye,oe,he,L.COLOR_BUFFER_BIT,L.NEAREST):Pt?L.copyTexSubImage3D(it,te,Be,Ye,rt+St,Ue,Le,oe,he):L.copyTexSubImage2D(it,te,Be,Ye,Ue,Le,oe,he);ge.bindFramebuffer(L.READ_FRAMEBUFFER,null),ge.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Pt?y.isDataTexture||y.isData3DTexture?L.texSubImage3D(it,te,Be,Ye,rt,oe,he,ue,Ke,Ae,Ze.data):F.isCompressedArrayTexture?L.compressedTexSubImage3D(it,te,Be,Ye,rt,oe,he,ue,Ke,Ze.data):L.texSubImage3D(it,te,Be,Ye,rt,oe,he,ue,Ke,Ae,Ze):y.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,te,Be,Ye,oe,he,Ke,Ae,Ze.data):y.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,te,Be,Ye,Ze.width,Ze.height,Ke,Ze.data):L.texSubImage2D(L.TEXTURE_2D,te,Be,Ye,oe,he,Ke,Ae,Ze);L.pixelStorei(L.UNPACK_ROW_LENGTH,Ge),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,At),L.pixelStorei(L.UNPACK_SKIP_PIXELS,_n),L.pixelStorei(L.UNPACK_SKIP_ROWS,yt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,On),te===0&&F.generateMipmaps&&L.generateMipmap(it),ge.unbindTexture()},this.copyTextureToTexture3D=function(y,F,V=null,H=null,O=0){return wi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(y,F,V,H,O)},this.initRenderTarget=function(y){xe.get(y).__webglFramebuffer===void 0&&Ne.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Ne.setTextureCube(y,0):y.isData3DTexture?Ne.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Ne.setTexture2DArray(y,0):Ne.setTexture2D(y,0),ge.unbindTexture()},this.resetState=function(){A=0,w=0,R=null,ge.reset(),Ie.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mo}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(n){this._outputColorSpace=n;const e=this.getContext();e.drawingBufferColorSpace=ot._getDrawingBufferColorSpace(n),e.unpackColorSpace=ot._getUnpackColorSpace()}}const bp=()=>{const[t,n]=dt.useState(0);return dt.useEffect(()=>{const e=()=>{console.warn("[useWebGLContextRecovery] WebGL context lost. Ride will pause and attempt to recover on context restoration.")},i=()=>{console.log("[useWebGLContextRecovery] WebGL context restored. Triggering scene rebuild."),n(r=>r+1)};return window.addEventListener("audiorailrider:webglcontextlost",e),window.addEventListener("audiorailrider:webglcontextrestored",i),()=>{window.removeEventListener("audiorailrider:webglcontextlost",e),window.removeEventListener("audiorailrider:webglcontextrestored",i)}},[]),t};class wp{constructor(n=1e3){N(this,"frames",0);N(this,"lastTime",performance.now());N(this,"lastFps",60);N(this,"sampleInterval");this.sampleInterval=n}tick(){this.frames++;const n=performance.now(),e=n-this.lastTime;if(e>=this.sampleInterval){const i=this.frames*1e3/e;return this.lastFps=i,this.frames=0,this.lastTime=n,i}return null}getLastFps(){return this.lastFps}}class Rp{constructor(n){N(this,"scene");N(this,"camera");N(this,"renderer");N(this,"container");N(this,"skyboxTexture");N(this,"handleResize",()=>{const n=this.container.clientWidth||(typeof window<"u"?window.innerWidth:1),e=this.container.clientHeight||(typeof window<"u"?window.innerHeight:1);this.camera.aspect=n/e,this.camera.updateProjectionMatrix();const i=typeof window<"u"&&window.devicePixelRatio?window.devicePixelRatio:1,r=Math.min(i,2);this.renderer.setPixelRatio(r),this.renderer.setSize(n,e)});N(this,"handleContextLost",n=>{n.preventDefault(),console.warn("[SceneManager] WebGL context lost. Notifying application."),window.dispatchEvent(new CustomEvent("audiorailrider:webglcontextlost"))});N(this,"handleContextRestored",()=>{console.log("[SceneManager] WebGL context restored. Notifying application to rebuild."),window.dispatchEvent(new CustomEvent("audiorailrider:webglcontextrestored"))});this.container=n,this.scene=new Oa;const e=this.container.clientWidth||(typeof window<"u"?window.innerWidth:1),i=this.container.clientHeight||(typeof window<"u"?window.innerHeight:1);this.camera=new jn(at.CAMERA_BASE_FOV,e/i,.1,2e3),this.renderer=new yp({antialias:!0,alpha:!0}),this.scene.userData=this.scene.userData||{},this.scene.userData._fpsMeter=new wp(1e3),this.init()}init(){const n=this.container.clientWidth||(typeof window<"u"?window.innerWidth:1),e=this.container.clientHeight||(typeof window<"u"?window.innerHeight:1);console.log("[SceneManager] Initializing renderer",{width:n,height:e,containerSize:{w:this.container.clientWidth,h:this.container.clientHeight}});const i=typeof window<"u"&&window.devicePixelRatio?window.devicePixelRatio:1,r=Math.min(i,2);this.renderer.setPixelRatio(r),this.renderer.setSize(n,e),console.log("[SceneManager] Appending canvas to container",{hasContainer:!!this.container,containerTagName:this.container.tagName,canvasSize:{w:this.renderer.domElement.width,h:this.renderer.domElement.height}}),this.renderer.domElement.style.display="block",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.container.appendChild(this.renderer.domElement),console.log("[SceneManager] Canvas appended",{childCount:this.container.children.length});const s=new Pe(657946),a=new Pe(0);this.scene.background=s,this.scene.fog=new Uc(a,100,1e3);const o=new Lc(16777215,.4);this.scene.add(o);const c=new Ps(16777215,.8);c.position.set(10,50,10),this.scene.add(c);const f=new Ps(6711039,.3);f.position.set(-10,20,-10),this.scene.add(f),console.log("[SceneManager] Lighting added to scene"),typeof window<"u"&&(window.addEventListener("resize",this.handleResize),this.renderer.domElement.addEventListener("webglcontextlost",this.handleContextLost,!1),this.renderer.domElement.addEventListener("webglcontextrestored",this.handleContextRestored,!1))}updateSkybox(n){this.skyboxTexture&&this.skyboxTexture.dispose(),new Ic().load(n,i=>{i.mapping=Ni,this.scene.background=i,this.scene.environment=i,this.skyboxTexture=i},void 0,i=>{console.error("An error occurred while loading the skybox texture:",i),this.scene.background=new Pe(0)})}render(){var n;try{const e=(n=this.scene.userData)==null?void 0:n._fpsMeter;if(e){const i=e.tick();i!==null&&(this.scene.userData.lodHint=i<40?"low":"high",i<30?this.renderer.setPixelRatio(1):this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)))}}catch{}this.renderer.render(this.scene,this.camera)}dispose(){typeof window<"u"&&(window.removeEventListener("resize",this.handleResize),this.renderer.domElement.removeEventListener("webglcontextlost",this.handleContextLost,!1),this.renderer.domElement.removeEventListener("webglcontextrestored",this.handleContextRestored,!1)),this.skyboxTexture&&this.skyboxTexture.dispose(),this.renderer.domElement.parentElement===this.container&&this.container.removeChild(this.renderer.domElement),this.renderer.dispose(),this.scene.clear()}}const Cp=t=>{const n=dt.useRef(null);return dt.useEffect(()=>{if(!t.current){console.error("[useSceneManager] mountRef.current is null!");return}const e=t.current;return console.log("[useSceneManager] Initializing SceneManager",{width:e.clientWidth,height:e.clientHeight}),n.current=new Rp(e),console.log("[useSceneManager] SceneManager initialized",{hasScene:!!n.current.scene,hasCamera:!!n.current.camera}),()=>{var i;console.log("[useSceneManager] Cleaning up scene"),(i=n.current)==null||i.dispose(),n.current=null}},[t]),n};class Pp{validate(n){if(n.length<2)return!0;for(let e=1;e<n.length;e++)if(e>1){const i=new z().subVectors(n[e-1],n[e-2]).normalize(),r=new z().subVectors(n[e],n[e-1]).normalize();i.dot(r)<.5&&console.warn(`Sharp turn detected at point ${e}`)}return!0}}class Up{generate(n,e,i,r){const s=[],a=[],c=n,f=Ee.degToRad(Ee.clamp(c.angle??15,-90,90)),m=Math.max(10,c.length)*1.25,p=i.clone();p.y=0,p.normalize();const l=e.clone().add(p.multiplyScalar(Math.cos(f)*m)).add(new z(0,Math.sin(f)*m,0));for(let d=1;d<=100;d++){const S=d/100;s.push(new z().lerpVectors(e,l,S)),a.push(r.clone())}return{points:s,upVectors:a}}}class Lp{generate(n,e,i,r){const s=[],a=[],c=n,f=Ee.degToRad(Ee.clamp(c.angle??-40,-90,90)),m=Math.max(10,c.length)*1.25,p=i.clone();p.y=0,p.normalize();const l=e.clone().add(p.multiplyScalar(Math.cos(f)*m)).add(new z(0,Math.sin(f)*m,0));for(let d=1;d<=100;d++){const S=d/100;s.push(new z().lerpVectors(e,l,S)),a.push(r.clone())}return{points:s,upVectors:a}}}class Ip{generate(n,e,i,r){const s=[],a=[],c=n,f=Math.max(10,c.radius??80)*1.25,m=Ee.degToRad(Ee.clamp(c.angle??90,-360,360)),p=c.direction==="left"?1:-1,l=new z(0,1,0),d=i.clone().cross(l).multiplyScalar(f*p),S=e.clone().add(d),E=e.clone().sub(S);for(let h=1;h<=100;h++){const u=h/100,M=E.clone().applyAxisAngle(l,m*u*-p);s.push(S.clone().add(M)),a.push(r.clone())}return{points:s,upVectors:a}}}class Dp{generate(n,e,i,r){const s=[],a=[],c=n,f=Math.max(10,c.radius??50)*1.25,m=Math.max(f*1.5,c.length?Math.max(20,Number(c.length))*1.25:f*Math.PI*.75),p=e.clone().add(i.clone().multiplyScalar(f));for(let l=1;l<=100;l++){const d=l/100,S=d*Math.PI*2,E=r.clone().multiplyScalar(Math.sin(S)*f),h=i.clone().multiplyScalar(-Math.cos(S)*f+d*m),u=p.clone().add(E).add(h);s.push(u),a.push(r.clone())}return{points:s,upVectors:a}}}class Np{generate(n,e,i,r){const s=[],a=[],c=n,f=Math.max(1,Math.round(c.rotations??1)),m=Math.max(10,c.length??150)*1.25,p=e.clone().add(i.clone().multiplyScalar(m));for(let l=1;l<=100;l++){const d=l/100,S=d*Math.PI*2*f;s.push(new z().lerpVectors(e,p,d)),a.push(r.clone().applyAxisAngle(i,S))}return{points:s,upVectors:a}}}class Fp{constructor(){N(this,"segmentGenerators");N(this,"validator");this.segmentGenerators=new Map,this.validator=new Pp,this.segmentGenerators.set("climb",new Up),this.segmentGenerators.set("drop",new Lp),this.segmentGenerators.set("turn",new Ip),this.segmentGenerators.set("loop",new Dp),this.segmentGenerators.set("barrelRoll",new Np)}compose(n,e){const i=[],r=[];let s=new z(0,5,0),a=new z(0,0,-1),o=new z(0,1,0);for(let l=0;l<10;l++)i.push(s.clone()),r.push(o.clone()),s.add(a);let c=[];const f=[];for(const l of n.track){const d=this.segmentGenerators.get(l.component);if(d){const S=i.length;let{points:E,upVectors:h}=d.generate(l,s,a,o);c.length>0&&(E=this.blendSegments(c,E)),i.push(...E),r.push(...h),E.length>0&&(s=E[E.length-1],E.length>1&&a.subVectors(E[E.length-1],E[E.length-2]).normalize(),o=h[h.length-1],c=E),f.push({start:S,end:i.length-1})}}this.validator.validate(i);const m=Math.max(i.length-1,1),p=f.map(l=>{const d=l.end/m;return Number.isFinite(d)?Ee.clamp(d,0,1):0});return{path:i,upVectors:r,railColor:n.palette[0]||"#ffffff",glowColor:n.palette[1]||"#00ffff",skyColor1:n.palette[2]||"#0d0a1f",skyColor2:"#000000",segmentDetails:n.track,segmentProgress:p,rideName:n.rideName,moodDescription:n.moodDescription,frameAnalyses:e.frameAnalyses,audioFeatures:e,events:[],synesthetic:null}}blendSegments(n,e){if(n.length===0||e.length===0)return e;const i=5,r=n[n.length-1];e[0];for(let s=1;s<=i&&!(s>=e.length);s++){const a=s/(i+1);e[s].lerpVectors(r,e[s],a)}return e}}const Op=(t,n)=>{const e=Yt(i=>i.actions.setTrackData);dt.useEffect(()=>{if(!t||!n)return;console.log("[useTrackComposer] Blueprint and audio features are available. Composing track...");const r=new Fp().compose(t,n);e(r),console.log("[useTrackComposer] Track data composed and set in store.")},[t,n,e])},Kt=class Kt{constructor(n,e){N(this,"camera");N(this,"curve");N(this,"trackData");N(this,"_pos",new z);N(this,"_lookAtPos",new z);N(this,"_upTmp",new z);N(this,"_sideTmp",new z);N(this,"_offsetTmp",new z);N(this,"_lookAtOffsetTmp",new z);N(this,"_cameraPosTmp",new z);N(this,"_lookTargetTmp",new z);N(this,"_lastSide",new z(1,0,0));N(this,"_blendedUp",new z(0,1,0));N(this,"_smoothedUp",new z(0,1,0));N(this,"_trackRadius",.35);this.camera=n,this.trackData=e,e.path&&e.path.length>1?this.curve=new xr(e.path,!1,"catmullrom",.5):this.curve=new xr([new z(0,0,0),new z(0,0,-1)])}get lookAtPos(){return this._lookAtPos}setTrackRadius(n){typeof n=="number"&&isFinite(n)&&n>0&&(this._trackRadius=n)}update(n){const e=Ee.clamp(n,0,1);this.curve.getPointAt(e,this._pos);const r=Math.min(.025,1-e);if(r>0)this.curve.getPointAt(e+r,this._lookAtPos);else{const l=this.curve.getTangentAt(e);this._lookAtPos.copy(this._pos).addScaledVector(l,1)}const s=this.curve.getTangentAt(e).normalize(),a=this.trackData.upVectors;if(a.length>=2){const l=e*(a.length-1),d=Math.floor(l),S=Math.min(d+1,a.length-1),E=l-d;this._upTmp.copy(a[d]).lerp(a[S],E)}else a.length===1?this._upTmp.copy(a[0]):this._upTmp.copy(Kt.WORLD_UP);this._upTmp.normalize(),this._blendedUp.copy(this._upTmp).lerp(Kt.WORLD_UP,.6).normalize(),this._smoothedUp.lerp(this._blendedUp,.2).normalize(),this.camera.up.copy(this._smoothedUp),this._sideTmp.crossVectors(s,Kt.WORLD_UP),this._sideTmp.lengthSq()<1e-6&&this._sideTmp.crossVectors(s,this._smoothedUp),this._sideTmp.lengthSq()<1e-6?this._sideTmp.copy(this._lastSide):(this._sideTmp.normalize(),this._lastSide.lerp(this._sideTmp,.3).normalize(),this._sideTmp.copy(this._lastSide)),Ee.clamp(1-Math.abs(this._smoothedUp.dot(Kt.WORLD_UP)),0,1);const c=this._trackRadius+.18,f=.12;this._offsetTmp.set(0,0,0).addScaledVector(this._sideTmp,c).addScaledVector(Kt.WORLD_UP,f),this._cameraPosTmp.copy(this._pos).add(this._offsetTmp),this.camera.position.copy(this._cameraPosTmp),this._lookAtOffsetTmp.set(0,0,0).addScaledVector(Kt.WORLD_UP,f*.55).addScaledVector(this._sideTmp,c*.28),this._lookTargetTmp.copy(this._lookAtPos).add(this._lookAtOffsetTmp),this.camera.lookAt(this._lookTargetTmp);const m=r>0?this._lookAtPos.distanceTo(this._pos)/r:0,p=Ee.clamp(m*1.35,0,160);this.camera.fov=at.CAMERA_BASE_FOV+Math.min(at.CAMERA_MAX_FOV_BOOST,p*at.CAMERA_SPEED_FOV_FACTOR),this.camera.updateProjectionMatrix()}};N(Kt,"WORLD_UP",new z(0,1,0));let br=Kt;const Ya=0,Bp=1,kp=2,ra=2,rr=1.25,sa=1,Jn=32,Vi=65535,Gp=Math.pow(2,-24),sr=Symbol("SKIP_GENERATION");function Vp(t){return t.index?t.index.count:t.attributes.position.count}function Fn(t){return Vp(t)/3}function Hp(t,n=ArrayBuffer){return t>65535?new Uint32Array(new n(4*t)):new Uint16Array(new n(2*t))}function zp(t,n){if(!t.index){const e=t.attributes.position.count,i=n.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,r=Hp(e,i);t.setIndex(new _t(r,1));for(let s=0;s<e;s++)r[s]=s}}function Ka(t,n){const e=Fn(t),i=n||t.drawRange,r=i.start/3,s=(i.start+i.count)/3,a=Math.max(0,r),o=Math.min(e,s)-a;return[{offset:Math.floor(a),count:Math.floor(o)}]}function $a(t,n){if(!t.groups||!t.groups.length)return Ka(t,n);const e=[],i=new Set,r=n||t.drawRange,s=r.start/3,a=(r.start+r.count)/3;for(const c of t.groups){const f=c.start/3,m=(c.start+c.count)/3;i.add(Math.max(s,f)),i.add(Math.min(a,m))}const o=Array.from(i.values()).sort((c,f)=>c-f);for(let c=0;c<o.length-1;c++){const f=o[c],m=o[c+1];e.push({offset:Math.floor(f),count:Math.floor(m-f)})}return e}function Wp(t,n){const e=Fn(t),i=$a(t,n).sort((a,o)=>a.offset-o.offset),r=i[i.length-1];r.count=Math.min(e-r.offset,r.count);let s=0;return i.forEach(({count:a})=>s+=a),e!==s}function ar(t,n,e,i,r){let s=1/0,a=1/0,o=1/0,c=-1/0,f=-1/0,m=-1/0,p=1/0,l=1/0,d=1/0,S=-1/0,E=-1/0,h=-1/0;for(let u=n*6,M=(n+e)*6;u<M;u+=6){const T=t[u+0],x=t[u+1],b=T-x,A=T+x;b<s&&(s=b),A>c&&(c=A),T<p&&(p=T),T>S&&(S=T);const w=t[u+2],R=t[u+3],_=w-R,g=w+R;_<a&&(a=_),g>f&&(f=g),w<l&&(l=w),w>E&&(E=w);const P=t[u+4],U=t[u+5],I=P-U,B=P+U;I<o&&(o=I),B>m&&(m=B),P<d&&(d=P),P>h&&(h=P)}i[0]=s,i[1]=a,i[2]=o,i[3]=c,i[4]=f,i[5]=m,r[0]=p,r[1]=l,r[2]=d,r[3]=S,r[4]=E,r[5]=h}function Xp(t,n=null,e=null,i=null){const r=t.attributes.position,s=t.index?t.index.array:null,a=Fn(t),o=r.normalized;let c;n===null?(c=new Float32Array(a*6*4),e=0,i=a):(c=n,e=e||0,i=i||a);const f=r.array,m=r.offset||0;let p=3;r.isInterleavedBufferAttribute&&(p=r.data.stride);const l=["getX","getY","getZ"];for(let d=e;d<e+i;d++){const S=d*3,E=d*6;let h=S+0,u=S+1,M=S+2;s&&(h=s[h],u=s[u],M=s[M]),o||(h=h*p+m,u=u*p+m,M=M*p+m);for(let T=0;T<3;T++){let x,b,A;o?(x=r[l[T]](h),b=r[l[T]](u),A=r[l[T]](M)):(x=f[h+T],b=f[u+T],A=f[M+T]);let w=x;b<w&&(w=b),A<w&&(w=A);let R=x;b>R&&(R=b),A>R&&(R=A);const _=(R-w)/2,g=T*2;c[E+g+0]=w+_,c[E+g+1]=_+(Math.abs(w)+_)*Gp}}return c}function st(t,n,e){return e.min.x=n[t],e.min.y=n[t+1],e.min.z=n[t+2],e.max.x=n[t+3],e.max.y=n[t+4],e.max.z=n[t+5],e}function aa(t){let n=-1,e=-1/0;for(let i=0;i<3;i++){const r=t[i+3]-t[i];r>e&&(e=r,n=i)}return n}function oa(t,n){n.set(t)}function ca(t,n,e){let i,r;for(let s=0;s<3;s++){const a=s+3;i=t[s],r=n[s],e[s]=i<r?i:r,i=t[a],r=n[a],e[a]=i>r?i:r}}function di(t,n,e){for(let i=0;i<3;i++){const r=n[t+2*i],s=n[t+2*i+1],a=r-s,o=r+s;a<e[i]&&(e[i]=a),o>e[i+3]&&(e[i+3]=o)}}function Gn(t){const n=t[3]-t[0],e=t[4]-t[1],i=t[5]-t[2];return 2*(n*e+e*i+i*n)}const qt=32,qp=(t,n)=>t.candidate-n.candidate,Zt=new Array(qt).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),pi=new Float32Array(6);function Yp(t,n,e,i,r,s){let a=-1,o=0;if(s===Ya)a=aa(n),a!==-1&&(o=(n[a]+n[a+3])/2);else if(s===Bp)a=aa(t),a!==-1&&(o=Kp(e,i,r,a));else if(s===kp){const c=Gn(t);let f=rr*r;const m=i*6,p=(i+r)*6;for(let l=0;l<3;l++){const d=n[l],h=(n[l+3]-d)/qt;if(r<qt/4){const u=[...Zt];u.length=r;let M=0;for(let x=m;x<p;x+=6,M++){const b=u[M];b.candidate=e[x+2*l],b.count=0;const{bounds:A,leftCacheBounds:w,rightCacheBounds:R}=b;for(let _=0;_<3;_++)R[_]=1/0,R[_+3]=-1/0,w[_]=1/0,w[_+3]=-1/0,A[_]=1/0,A[_+3]=-1/0;di(x,e,A)}u.sort(qp);let T=r;for(let x=0;x<T;x++){const b=u[x];for(;x+1<T&&u[x+1].candidate===b.candidate;)u.splice(x+1,1),T--}for(let x=m;x<p;x+=6){const b=e[x+2*l];for(let A=0;A<T;A++){const w=u[A];b>=w.candidate?di(x,e,w.rightCacheBounds):(di(x,e,w.leftCacheBounds),w.count++)}}for(let x=0;x<T;x++){const b=u[x],A=b.count,w=r-b.count,R=b.leftCacheBounds,_=b.rightCacheBounds;let g=0;A!==0&&(g=Gn(R)/c);let P=0;w!==0&&(P=Gn(_)/c);const U=sa+rr*(g*A+P*w);U<f&&(a=l,f=U,o=b.candidate)}}else{for(let T=0;T<qt;T++){const x=Zt[T];x.count=0,x.candidate=d+h+T*h;const b=x.bounds;for(let A=0;A<3;A++)b[A]=1/0,b[A+3]=-1/0}for(let T=m;T<p;T+=6){let A=~~((e[T+2*l]-d)/h);A>=qt&&(A=qt-1);const w=Zt[A];w.count++,di(T,e,w.bounds)}const u=Zt[qt-1];oa(u.bounds,u.rightCacheBounds);for(let T=qt-2;T>=0;T--){const x=Zt[T],b=Zt[T+1];ca(x.bounds,b.rightCacheBounds,x.rightCacheBounds)}let M=0;for(let T=0;T<qt-1;T++){const x=Zt[T],b=x.count,A=x.bounds,R=Zt[T+1].rightCacheBounds;b!==0&&(M===0?oa(A,pi):ca(A,pi,pi)),M+=b;let _=0,g=0;M!==0&&(_=Gn(pi)/c);const P=r-M;P!==0&&(g=Gn(R)/c);const U=sa+rr*(_*M+g*P);U<f&&(a=l,f=U,o=x.candidate)}}}}else console.warn(`MeshBVH: Invalid build strategy value ${s} used.`);return{axis:a,pos:o}}function Kp(t,n,e,i){let r=0;for(let s=n,a=n+e;s<a;s++)r+=t[s*6+i*2];return r/e}class or{constructor(){this.boundingData=new Float32Array(6)}}function $p(t,n,e,i,r,s){let a=i,o=i+r-1;const c=s.pos,f=s.axis*2;for(;;){for(;a<=o&&e[a*6+f]<c;)a++;for(;a<=o&&e[o*6+f]>=c;)o--;if(a<o){for(let m=0;m<3;m++){let p=n[a*3+m];n[a*3+m]=n[o*3+m],n[o*3+m]=p}for(let m=0;m<6;m++){let p=e[a*6+m];e[a*6+m]=e[o*6+m],e[o*6+m]=p}a++,o--}else return a}}function Qp(t,n,e,i,r,s){let a=i,o=i+r-1;const c=s.pos,f=s.axis*2;for(;;){for(;a<=o&&e[a*6+f]<c;)a++;for(;a<=o&&e[o*6+f]>=c;)o--;if(a<o){let m=t[a];t[a]=t[o],t[o]=m;for(let p=0;p<6;p++){let l=e[a*6+p];e[a*6+p]=e[o*6+p],e[o*6+p]=l}a++,o--}else return a}}function Tt(t,n){return n[t+15]===65535}function Rt(t,n){return n[t+6]}function It(t,n){return n[t+14]}function Dt(t){return t+8}function Nt(t,n){return n[t+6]}function Qa(t,n){return n[t+7]}let Za,Zn,Pi,ja;const Zp=Math.pow(2,32);function wr(t){return"count"in t?1:1+wr(t.left)+wr(t.right)}function jp(t,n,e){return Za=new Float32Array(e),Zn=new Uint32Array(e),Pi=new Uint16Array(e),ja=new Uint8Array(e),Rr(t,n)}function Rr(t,n){const e=t/4,i=t/2,r="count"in n,s=n.boundingData;for(let a=0;a<6;a++)Za[e+a]=s[a];if(r)if(n.buffer){const a=n.buffer;ja.set(new Uint8Array(a),t);for(let o=t,c=t+a.byteLength;o<c;o+=Jn){const f=o/2;Tt(f,Pi)||(Zn[o/4+6]+=e)}return t+a.byteLength}else{const a=n.offset,o=n.count;return Zn[e+6]=a,Pi[i+14]=o,Pi[i+15]=Vi,t+Jn}else{const a=n.left,o=n.right,c=n.splitAxis;let f;if(f=Rr(t+Jn,a),f/4>Zp)throw new Error("MeshBVH: Cannot store child pointer greater than 32 bits.");return Zn[e+6]=f/4,f=Rr(f,o),Zn[e+7]=c,f}}function Jp(t,n){const e=(t.index?t.index.count:t.attributes.position.count)/3,i=e>2**16,r=i?4:2,s=n?new SharedArrayBuffer(e*r):new ArrayBuffer(e*r),a=i?new Uint32Array(s):new Uint16Array(s);for(let o=0,c=a.length;o<c;o++)a[o]=o;return a}function eh(t,n,e,i,r){const{maxDepth:s,verbose:a,maxLeafTris:o,strategy:c,onProgress:f,indirect:m}=r,p=t._indirectBuffer,l=t.geometry,d=l.index?l.index.array:null,S=m?Qp:$p,E=Fn(l),h=new Float32Array(6);let u=!1;const M=new or;return ar(n,e,i,M.boundingData,h),x(M,e,i,h),M;function T(b){f&&f(b/E)}function x(b,A,w,R=null,_=0){if(!u&&_>=s&&(u=!0,a&&(console.warn(`MeshBVH: Max depth of ${s} reached when generating BVH. Consider increasing maxDepth.`),console.warn(l))),w<=o||_>=s)return T(A+w),b.offset=A,b.count=w,b;const g=Yp(b.boundingData,R,n,A,w,c);if(g.axis===-1)return T(A+w),b.offset=A,b.count=w,b;const P=S(p,d,n,A,w,g);if(P===A||P===A+w)T(A+w),b.offset=A,b.count=w;else{b.splitAxis=g.axis;const U=new or,I=A,B=P-A;b.left=U,ar(n,I,B,U.boundingData,h),x(U,I,B,h,_+1);const X=new or,G=P,ee=w-B;b.right=X,ar(n,G,ee,X.boundingData,h),x(X,G,ee,h,_+1)}return b}}function th(t,n){const e=t.geometry;n.indirect&&(t._indirectBuffer=Jp(e,n.useSharedArrayBuffer),Wp(e,n.range)&&!n.verbose&&console.warn('MeshBVH: Provided geometry contains groups or a range that do not fully span the vertex contents while using the "indirect" option. BVH may incorrectly report intersections on unrendered portions of the geometry.')),t._indirectBuffer||zp(e,n);const i=n.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,r=Xp(e),s=n.indirect?Ka(e,n.range):$a(e,n.range);t._roots=s.map(a=>{const o=eh(t,r,a.offset,a.count,n),c=wr(o),f=new i(Jn*c);return jp(0,o,f),f})}class Qt{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(n,e){let i=1/0,r=-1/0;for(let s=0,a=n.length;s<a;s++){const c=n[s][e];i=c<i?c:i,r=c>r?c:r}this.min=i,this.max=r}setFromPoints(n,e){let i=1/0,r=-1/0;for(let s=0,a=e.length;s<a;s++){const o=e[s],c=n.dot(o);i=c<i?c:i,r=c>r?c:r}this.min=i,this.max=r}isSeparated(n){return this.min>n.max||n.min>this.max}}Qt.prototype.setFromBox=(function(){const t=new z;return function(e,i){const r=i.min,s=i.max;let a=1/0,o=-1/0;for(let c=0;c<=1;c++)for(let f=0;f<=1;f++)for(let m=0;m<=1;m++){t.x=r.x*c+s.x*(1-c),t.y=r.y*f+s.y*(1-f),t.z=r.z*m+s.z*(1-m);const p=e.dot(t);a=Math.min(p,a),o=Math.max(p,o)}this.min=a,this.max=o}})();const nh=(function(){const t=new z,n=new z,e=new z;return function(r,s,a){const o=r.start,c=t,f=s.start,m=n;e.subVectors(o,f),t.subVectors(r.end,r.start),n.subVectors(s.end,s.start);const p=e.dot(m),l=m.dot(c),d=m.dot(m),S=e.dot(c),h=c.dot(c)*d-l*l;let u,M;h!==0?u=(p*l-S*d)/h:u=0,M=(p+u*l)/d,a.x=u,a.y=M}})(),Gr=(function(){const t=new lt,n=new z,e=new z;return function(r,s,a,o){nh(r,s,t);let c=t.x,f=t.y;if(c>=0&&c<=1&&f>=0&&f<=1){r.at(c,a),s.at(f,o);return}else if(c>=0&&c<=1){f<0?s.at(0,o):s.at(1,o),r.closestPointToPoint(o,!0,a);return}else if(f>=0&&f<=1){c<0?r.at(0,a):r.at(1,a),s.closestPointToPoint(a,!0,o);return}else{let m;c<0?m=r.start:m=r.end;let p;f<0?p=s.start:p=s.end;const l=n,d=e;if(r.closestPointToPoint(p,!0,n),s.closestPointToPoint(m,!0,e),l.distanceToSquared(p)<=d.distanceToSquared(m)){a.copy(l),o.copy(p);return}else{a.copy(m),o.copy(d);return}}}})(),ih=(function(){const t=new z,n=new z,e=new Br,i=new $t;return function(s,a){const{radius:o,center:c}=s,{a:f,b:m,c:p}=a;if(i.start=f,i.end=m,i.closestPointToPoint(c,!0,t).distanceTo(c)<=o||(i.start=f,i.end=p,i.closestPointToPoint(c,!0,t).distanceTo(c)<=o)||(i.start=m,i.end=p,i.closestPointToPoint(c,!0,t).distanceTo(c)<=o))return!0;const E=a.getPlane(e);if(Math.abs(E.distanceToPoint(c))<=o){const u=E.projectPoint(c,n);if(a.containsPoint(u))return!0}return!1}})(),rh=1e-15;function cr(t){return Math.abs(t)<rh}class Vt extends Kn{constructor(...n){super(...n),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new z),this.satBounds=new Array(4).fill().map(()=>new Qt),this.points=[this.a,this.b,this.c],this.sphere=new Dc,this.plane=new Br,this.needsUpdate=!0}intersectsSphere(n){return ih(n,this)}update(){const n=this.a,e=this.b,i=this.c,r=this.points,s=this.satAxes,a=this.satBounds,o=s[0],c=a[0];this.getNormal(o),c.setFromPoints(o,r);const f=s[1],m=a[1];f.subVectors(n,e),m.setFromPoints(f,r);const p=s[2],l=a[2];p.subVectors(e,i),l.setFromPoints(p,r);const d=s[3],S=a[3];d.subVectors(i,n),S.setFromPoints(d,r),this.sphere.setFromPoints(this.points),this.plane.setFromNormalAndCoplanarPoint(o,n),this.needsUpdate=!1}}Vt.prototype.closestPointToSegment=(function(){const t=new z,n=new z,e=new $t;return function(r,s=null,a=null){const{start:o,end:c}=r,f=this.points;let m,p=1/0;for(let l=0;l<3;l++){const d=(l+1)%3;e.start.copy(f[l]),e.end.copy(f[d]),Gr(e,r,t,n),m=t.distanceToSquared(n),m<p&&(p=m,s&&s.copy(t),a&&a.copy(n))}return this.closestPointToPoint(o,t),m=o.distanceToSquared(t),m<p&&(p=m,s&&s.copy(t),a&&a.copy(o)),this.closestPointToPoint(c,t),m=c.distanceToSquared(t),m<p&&(p=m,s&&s.copy(t),a&&a.copy(c)),Math.sqrt(p)}})();Vt.prototype.intersectsTriangle=(function(){const t=new Vt,n=new Array(3),e=new Array(3),i=new Qt,r=new Qt,s=new z,a=new z,o=new z,c=new z,f=new z,m=new $t,p=new $t,l=new $t,d=new z;function S(E,h,u){const M=E.points;let T=0,x=-1;for(let b=0;b<3;b++){const{start:A,end:w}=m;A.copy(M[b]),w.copy(M[(b+1)%3]),m.delta(a);const R=cr(h.distanceToPoint(A));if(cr(h.normal.dot(a))&&R){u.copy(m),T=2;break}const _=h.intersectLine(m,d);if(!_&&R&&d.copy(A),(_||R)&&!cr(d.distanceTo(w))){if(T<=1)(T===1?u.start:u.end).copy(d),R&&(x=T);else if(T>=2){(x===1?u.start:u.end).copy(d),T=2;break}if(T++,T===2&&x===-1)break}}return T}return function(h,u=null,M=!1){this.needsUpdate&&this.update(),h.isExtendedTriangle?h.needsUpdate&&h.update():(t.copy(h),t.update(),h=t);const T=this.plane,x=h.plane;if(Math.abs(T.normal.dot(x.normal))>1-1e-10){const b=this.satBounds,A=this.satAxes;e[0]=h.a,e[1]=h.b,e[2]=h.c;for(let _=0;_<4;_++){const g=b[_],P=A[_];if(i.setFromPoints(P,e),g.isSeparated(i))return!1}const w=h.satBounds,R=h.satAxes;n[0]=this.a,n[1]=this.b,n[2]=this.c;for(let _=0;_<4;_++){const g=w[_],P=R[_];if(i.setFromPoints(P,n),g.isSeparated(i))return!1}for(let _=0;_<4;_++){const g=A[_];for(let P=0;P<4;P++){const U=R[P];if(s.crossVectors(g,U),i.setFromPoints(s,n),r.setFromPoints(s,e),i.isSeparated(r))return!1}}return u&&(M||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),u.start.set(0,0,0),u.end.set(0,0,0)),!0}else{const b=S(this,x,p);if(b===1&&h.containsPoint(p.end))return u&&(u.start.copy(p.end),u.end.copy(p.end)),!0;if(b!==2)return!1;const A=S(h,T,l);if(A===1&&this.containsPoint(l.end))return u&&(u.start.copy(l.end),u.end.copy(l.end)),!0;if(A!==2)return!1;if(p.delta(o),l.delta(c),o.dot(c)<0){let I=l.start;l.start=l.end,l.end=I}const w=p.start.dot(o),R=p.end.dot(o),_=l.start.dot(o),g=l.end.dot(o),P=R<_,U=w<g;return w!==g&&_!==R&&P===U?!1:(u&&(f.subVectors(p.start,l.start),f.dot(o)>0?u.start.copy(p.start):u.start.copy(l.start),f.subVectors(p.end,l.end),f.dot(o)<0?u.end.copy(p.end):u.end.copy(l.end)),!0)}}})();Vt.prototype.distanceToPoint=(function(){const t=new z;return function(e){return this.closestPointToPoint(e,t),e.distanceTo(t)}})();Vt.prototype.distanceToTriangle=(function(){const t=new z,n=new z,e=["a","b","c"],i=new $t,r=new $t;return function(a,o=null,c=null){const f=o||c?i:null;if(this.intersectsTriangle(a,f))return(o||c)&&(o&&f.getCenter(o),c&&f.getCenter(c)),0;let m=1/0;for(let p=0;p<3;p++){let l;const d=e[p],S=a[d];this.closestPointToPoint(S,t),l=S.distanceToSquared(t),l<m&&(m=l,o&&o.copy(t),c&&c.copy(S));const E=this[d];a.closestPointToPoint(E,t),l=E.distanceToSquared(t),l<m&&(m=l,o&&o.copy(E),c&&c.copy(t))}for(let p=0;p<3;p++){const l=e[p],d=e[(p+1)%3];i.set(this[l],this[d]);for(let S=0;S<3;S++){const E=e[S],h=e[(S+1)%3];r.set(a[E],a[h]),Gr(i,r,t,n);const u=t.distanceToSquared(n);u<m&&(m=u,o&&o.copy(t),c&&c.copy(n))}}return Math.sqrt(m)}})();class vt{constructor(n,e,i){this.isOrientedBox=!0,this.min=new z,this.max=new z,this.matrix=new ft,this.invMatrix=new ft,this.points=new Array(8).fill().map(()=>new z),this.satAxes=new Array(3).fill().map(()=>new z),this.satBounds=new Array(3).fill().map(()=>new Qt),this.alignedSatBounds=new Array(3).fill().map(()=>new Qt),this.needsUpdate=!1,n&&this.min.copy(n),e&&this.max.copy(e),i&&this.matrix.copy(i)}set(n,e,i){this.min.copy(n),this.max.copy(e),this.matrix.copy(i),this.needsUpdate=!0}copy(n){this.min.copy(n.min),this.max.copy(n.max),this.matrix.copy(n.matrix),this.needsUpdate=!0}}vt.prototype.update=(function(){return function(){const n=this.matrix,e=this.min,i=this.max,r=this.points;for(let f=0;f<=1;f++)for(let m=0;m<=1;m++)for(let p=0;p<=1;p++){const l=1*f|2*m|4*p,d=r[l];d.x=f?i.x:e.x,d.y=m?i.y:e.y,d.z=p?i.z:e.z,d.applyMatrix4(n)}const s=this.satBounds,a=this.satAxes,o=r[0];for(let f=0;f<3;f++){const m=a[f],p=s[f],l=1<<f,d=r[l];m.subVectors(o,d),p.setFromPoints(m,r)}const c=this.alignedSatBounds;c[0].setFromPointsField(r,"x"),c[1].setFromPointsField(r,"y"),c[2].setFromPointsField(r,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}})();vt.prototype.intersectsBox=(function(){const t=new Qt;return function(e){this.needsUpdate&&this.update();const i=e.min,r=e.max,s=this.satBounds,a=this.satAxes,o=this.alignedSatBounds;if(t.min=i.x,t.max=r.x,o[0].isSeparated(t)||(t.min=i.y,t.max=r.y,o[1].isSeparated(t))||(t.min=i.z,t.max=r.z,o[2].isSeparated(t)))return!1;for(let c=0;c<3;c++){const f=a[c],m=s[c];if(t.setFromBox(f,e),m.isSeparated(t))return!1}return!0}})();vt.prototype.intersectsTriangle=(function(){const t=new Vt,n=new Array(3),e=new Qt,i=new Qt,r=new z;return function(a){this.needsUpdate&&this.update(),a.isExtendedTriangle?a.needsUpdate&&a.update():(t.copy(a),t.update(),a=t);const o=this.satBounds,c=this.satAxes;n[0]=a.a,n[1]=a.b,n[2]=a.c;for(let l=0;l<3;l++){const d=o[l],S=c[l];if(e.setFromPoints(S,n),d.isSeparated(e))return!1}const f=a.satBounds,m=a.satAxes,p=this.points;for(let l=0;l<3;l++){const d=f[l],S=m[l];if(e.setFromPoints(S,p),d.isSeparated(e))return!1}for(let l=0;l<3;l++){const d=c[l];for(let S=0;S<4;S++){const E=m[S];if(r.crossVectors(d,E),e.setFromPoints(r,n),i.setFromPoints(r,p),e.isSeparated(i))return!1}}return!0}})();vt.prototype.closestPointToPoint=(function(){return function(n,e){return this.needsUpdate&&this.update(),e.copy(n).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),e}})();vt.prototype.distanceToPoint=(function(){const t=new z;return function(e){return this.closestPointToPoint(e,t),e.distanceTo(t)}})();vt.prototype.distanceToBox=(function(){const t=["x","y","z"],n=new Array(12).fill().map(()=>new $t),e=new Array(12).fill().map(()=>new $t),i=new z,r=new z;return function(a,o=0,c=null,f=null){if(this.needsUpdate&&this.update(),this.intersectsBox(a))return(c||f)&&(a.getCenter(r),this.closestPointToPoint(r,i),a.closestPointToPoint(i,r),c&&c.copy(i),f&&f.copy(r)),0;const m=o*o,p=a.min,l=a.max,d=this.points;let S=1/0;for(let h=0;h<8;h++){const u=d[h];r.copy(u).clamp(p,l);const M=u.distanceToSquared(r);if(M<S&&(S=M,c&&c.copy(u),f&&f.copy(r),M<m))return Math.sqrt(M)}let E=0;for(let h=0;h<3;h++)for(let u=0;u<=1;u++)for(let M=0;M<=1;M++){const T=(h+1)%3,x=(h+2)%3,b=u<<T|M<<x,A=1<<h|u<<T|M<<x,w=d[b],R=d[A];n[E].set(w,R);const g=t[h],P=t[T],U=t[x],I=e[E],B=I.start,X=I.end;B[g]=p[g],B[P]=u?p[P]:l[P],B[U]=M?p[U]:l[P],X[g]=l[g],X[P]=u?p[P]:l[P],X[U]=M?p[U]:l[P],E++}for(let h=0;h<=1;h++)for(let u=0;u<=1;u++)for(let M=0;M<=1;M++){r.x=h?l.x:p.x,r.y=u?l.y:p.y,r.z=M?l.z:p.z,this.closestPointToPoint(r,i);const T=r.distanceToSquared(i);if(T<S&&(S=T,c&&c.copy(i),f&&f.copy(r),T<m))return Math.sqrt(T)}for(let h=0;h<12;h++){const u=n[h];for(let M=0;M<12;M++){const T=e[M];Gr(u,T,i,r);const x=i.distanceToSquared(r);if(x<S&&(S=x,c&&c.copy(i),f&&f.copy(r),x<m))return Math.sqrt(x)}}return Math.sqrt(S)}})();class Vr{constructor(n){this._getNewPrimitive=n,this._primitives=[]}getPrimitive(){const n=this._primitives;return n.length===0?this._getNewPrimitive():n.pop()}releasePrimitive(n){this._primitives.push(n)}}class sh extends Vr{constructor(){super(()=>new Vt)}}const Ft=new sh;class ah{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;const n=[];let e=null;this.setBuffer=i=>{e&&n.push(e),e=i,this.float32Array=new Float32Array(i),this.uint16Array=new Uint16Array(i),this.uint32Array=new Uint32Array(i)},this.clearBuffer=()=>{e=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,n.length!==0&&this.setBuffer(n.pop())}}}const Je=new ah;let tn,In;const Sn=[],hi=new Vr(()=>new zt);function oh(t,n,e,i,r,s){tn=hi.getPrimitive(),In=hi.getPrimitive(),Sn.push(tn,In),Je.setBuffer(t._roots[n]);const a=Cr(0,t.geometry,e,i,r,s);Je.clearBuffer(),hi.releasePrimitive(tn),hi.releasePrimitive(In),Sn.pop(),Sn.pop();const o=Sn.length;return o>0&&(In=Sn[o-1],tn=Sn[o-2]),a}function Cr(t,n,e,i,r=null,s=0,a=0){const{float32Array:o,uint16Array:c,uint32Array:f}=Je;let m=t*2;if(Tt(m,c)){const l=Rt(t,f),d=It(m,c);return st(t,o,tn),i(l,d,!1,a,s+t,tn)}else{let g=function(U){const{uint16Array:I,uint32Array:B}=Je;let X=U*2;for(;!Tt(X,I);)U=Dt(U),X=U*2;return Rt(U,B)},P=function(U){const{uint16Array:I,uint32Array:B}=Je;let X=U*2;for(;!Tt(X,I);)U=Nt(U,B),X=U*2;return Rt(U,B)+It(X,I)};const l=Dt(t),d=Nt(t,f);let S=l,E=d,h,u,M,T;if(r&&(M=tn,T=In,st(S,o,M),st(E,o,T),h=r(M),u=r(T),u<h)){S=d,E=l;const U=h;h=u,u=U,M=T}M||(M=tn,st(S,o,M));const x=Tt(S*2,c),b=e(M,x,h,a+1,s+S);let A;if(b===ra){const U=g(S),B=P(S)-U;A=i(U,B,!0,a+1,s+S,M)}else A=b&&Cr(S,n,e,i,r,s,a+1);if(A)return!0;T=In,st(E,o,T);const w=Tt(E*2,c),R=e(T,w,u,a+1,s+E);let _;if(R===ra){const U=g(E),B=P(E)-U;_=i(U,B,!0,a+1,s+E,T)}else _=R&&Cr(E,n,e,i,r,s,a+1);return!!_}}const Vn=new z,lr=new z;function ch(t,n,e={},i=0,r=1/0){const s=i*i,a=r*r;let o=1/0,c=null;if(t.shapecast({boundsTraverseOrder:m=>(Vn.copy(n).clamp(m.min,m.max),Vn.distanceToSquared(n)),intersectsBounds:(m,p,l)=>l<o&&l<a,intersectsTriangle:(m,p)=>{m.closestPointToPoint(n,Vn);const l=n.distanceToSquared(Vn);return l<o&&(lr.copy(Vn),o=l,c=p),l<s}}),o===1/0)return null;const f=Math.sqrt(o);return e.point?e.point.copy(lr):e.point=lr.clone(),e.distance=f,e.faceIndex=c,e}const Mn=new z,En=new z,Tn=new z,mi=new lt,gi=new lt,_i=new lt,la=new z,ua=new z,fa=new z,vi=new z;function lh(t,n,e,i,r,s,a,o){let c;if(s===xt?c=t.intersectTriangle(i,e,n,!0,r):c=t.intersectTriangle(n,e,i,s!==Lt,r),c===null)return null;const f=t.origin.distanceTo(r);return f<a||f>o?null:{distance:f,point:r.clone()}}function uh(t,n,e,i,r,s,a,o,c,f,m){Mn.fromBufferAttribute(n,s),En.fromBufferAttribute(n,a),Tn.fromBufferAttribute(n,o);const p=lh(t,Mn,En,Tn,vi,c,f,m);if(p){i&&(mi.fromBufferAttribute(i,s),gi.fromBufferAttribute(i,a),_i.fromBufferAttribute(i,o),p.uv=Kn.getInterpolation(vi,Mn,En,Tn,mi,gi,_i,new lt)),r&&(mi.fromBufferAttribute(r,s),gi.fromBufferAttribute(r,a),_i.fromBufferAttribute(r,o),p.uv1=Kn.getInterpolation(vi,Mn,En,Tn,mi,gi,_i,new lt)),e&&(la.fromBufferAttribute(e,s),ua.fromBufferAttribute(e,a),fa.fromBufferAttribute(e,o),p.normal=Kn.getInterpolation(vi,Mn,En,Tn,la,ua,fa,new z),p.normal.dot(t.direction)>0&&p.normal.multiplyScalar(-1));const l={a:s,b:a,c:o,normal:new z,materialIndex:0};Kn.getNormal(Mn,En,Tn,l.normal),p.face=l,p.faceIndex=s}return p}function Hi(t,n,e,i,r,s,a){const o=i*3;let c=o+0,f=o+1,m=o+2;const p=t.index;t.index&&(c=p.getX(c),f=p.getX(f),m=p.getX(m));const{position:l,normal:d,uv:S,uv1:E}=t.attributes,h=uh(e,l,d,S,E,c,f,m,n,s,a);return h?(h.faceIndex=i,r&&r.push(h),h):null}function ct(t,n,e,i){const r=t.a,s=t.b,a=t.c;let o=n,c=n+1,f=n+2;e&&(o=e.getX(o),c=e.getX(c),f=e.getX(f)),r.x=i.getX(o),r.y=i.getY(o),r.z=i.getZ(o),s.x=i.getX(c),s.y=i.getY(c),s.z=i.getZ(c),a.x=i.getX(f),a.y=i.getY(f),a.z=i.getZ(f)}function fh(t,n,e,i,r,s,a,o){const{geometry:c,_indirectBuffer:f}=t;for(let m=i,p=i+r;m<p;m++)Hi(c,n,e,m,s,a,o)}function dh(t,n,e,i,r,s,a){const{geometry:o,_indirectBuffer:c}=t;let f=1/0,m=null;for(let p=i,l=i+r;p<l;p++){let d;d=Hi(o,n,e,p,null,s,a),d&&d.distance<f&&(m=d,f=d.distance)}return m}function ph(t,n,e,i,r,s,a){const{geometry:o}=e,{index:c}=o,f=o.attributes.position;for(let m=t,p=n+t;m<p;m++){let l;if(l=m,ct(a,l*3,c,f),a.needsUpdate=!0,i(a,l,r,s))return!0}return!1}function hh(t,n=null){n&&Array.isArray(n)&&(n=new Set(n));const e=t.geometry,i=e.index?e.index.array:null,r=e.attributes.position;let s,a,o,c,f=0;const m=t._roots;for(let l=0,d=m.length;l<d;l++)s=m[l],a=new Uint32Array(s),o=new Uint16Array(s),c=new Float32Array(s),p(0,f),f+=s.byteLength;function p(l,d,S=!1){const E=l*2;if(o[E+15]===Vi){const u=a[l+6],M=o[E+14];let T=1/0,x=1/0,b=1/0,A=-1/0,w=-1/0,R=-1/0;for(let _=3*u,g=3*(u+M);_<g;_++){let P=i[_];const U=r.getX(P),I=r.getY(P),B=r.getZ(P);U<T&&(T=U),U>A&&(A=U),I<x&&(x=I),I>w&&(w=I),B<b&&(b=B),B>R&&(R=B)}return c[l+0]!==T||c[l+1]!==x||c[l+2]!==b||c[l+3]!==A||c[l+4]!==w||c[l+5]!==R?(c[l+0]=T,c[l+1]=x,c[l+2]=b,c[l+3]=A,c[l+4]=w,c[l+5]=R,!0):!1}else{const u=l+8,M=a[l+6],T=u+d,x=M+d;let b=S,A=!1,w=!1;n?b||(A=n.has(T),w=n.has(x),b=!A&&!w):(A=!0,w=!0);const R=b||A,_=b||w;let g=!1;R&&(g=p(u,d,b));let P=!1;_&&(P=p(M,d,b));const U=g||P;if(U)for(let I=0;I<3;I++){const B=u+I,X=M+I,G=c[B],ee=c[B+3],W=c[X],fe=c[X+3];c[l+I]=G<W?G:W,c[l+I+3]=ee>fe?ee:fe}return U}}}function sn(t,n,e,i,r){let s,a,o,c,f,m;const p=1/e.direction.x,l=1/e.direction.y,d=1/e.direction.z,S=e.origin.x,E=e.origin.y,h=e.origin.z;let u=n[t],M=n[t+3],T=n[t+1],x=n[t+3+1],b=n[t+2],A=n[t+3+2];return p>=0?(s=(u-S)*p,a=(M-S)*p):(s=(M-S)*p,a=(u-S)*p),l>=0?(o=(T-E)*l,c=(x-E)*l):(o=(x-E)*l,c=(T-E)*l),s>c||o>a||((o>s||isNaN(s))&&(s=o),(c<a||isNaN(a))&&(a=c),d>=0?(f=(b-h)*d,m=(A-h)*d):(f=(A-h)*d,m=(b-h)*d),s>m||f>a)?!1:((f>s||s!==s)&&(s=f),(m<a||a!==a)&&(a=m),s<=r&&a>=i)}function mh(t,n,e,i,r,s,a,o){const{geometry:c,_indirectBuffer:f}=t;for(let m=i,p=i+r;m<p;m++){let l=f?f[m]:m;Hi(c,n,e,l,s,a,o)}}function gh(t,n,e,i,r,s,a){const{geometry:o,_indirectBuffer:c}=t;let f=1/0,m=null;for(let p=i,l=i+r;p<l;p++){let d;d=Hi(o,n,e,c?c[p]:p,null,s,a),d&&d.distance<f&&(m=d,f=d.distance)}return m}function _h(t,n,e,i,r,s,a){const{geometry:o}=e,{index:c}=o,f=o.attributes.position;for(let m=t,p=n+t;m<p;m++){let l;if(l=e.resolveTriangleIndex(m),ct(a,l*3,c,f),a.needsUpdate=!0,i(a,l,r,s))return!0}return!1}function vh(t,n,e,i,r,s,a){Je.setBuffer(t._roots[n]),Pr(0,t,e,i,r,s,a),Je.clearBuffer()}function Pr(t,n,e,i,r,s,a){const{float32Array:o,uint16Array:c,uint32Array:f}=Je,m=t*2;if(Tt(m,c)){const l=Rt(t,f),d=It(m,c);fh(n,e,i,l,d,r,s,a)}else{const l=Dt(t);sn(l,o,i,s,a)&&Pr(l,n,e,i,r,s,a);const d=Nt(t,f);sn(d,o,i,s,a)&&Pr(d,n,e,i,r,s,a)}}const Sh=["x","y","z"];function Mh(t,n,e,i,r,s){Je.setBuffer(t._roots[n]);const a=Ur(0,t,e,i,r,s);return Je.clearBuffer(),a}function Ur(t,n,e,i,r,s){const{float32Array:a,uint16Array:o,uint32Array:c}=Je;let f=t*2;if(Tt(f,o)){const p=Rt(t,c),l=It(f,o);return dh(n,e,i,p,l,r,s)}else{const p=Qa(t,c),l=Sh[p],S=i.direction[l]>=0;let E,h;S?(E=Dt(t),h=Nt(t,c)):(E=Nt(t,c),h=Dt(t));const M=sn(E,a,i,r,s)?Ur(E,n,e,i,r,s):null;if(M){const b=M.point[l];if(S?b<=a[h+p]:b>=a[h+p+3])return M}const x=sn(h,a,i,r,s)?Ur(h,n,e,i,r,s):null;return M&&x?M.distance<=x.distance?M:x:M||x||null}}const Si=new zt,xn=new Vt,An=new Vt,Hn=new ft,da=new vt,Mi=new vt;function Eh(t,n,e,i){Je.setBuffer(t._roots[n]);const r=Lr(0,t,e,i);return Je.clearBuffer(),r}function Lr(t,n,e,i,r=null){const{float32Array:s,uint16Array:a,uint32Array:o}=Je;let c=t*2;if(r===null&&(e.boundingBox||e.computeBoundingBox(),da.set(e.boundingBox.min,e.boundingBox.max,i),r=da),Tt(c,a)){const m=n.geometry,p=m.index,l=m.attributes.position,d=e.index,S=e.attributes.position,E=Rt(t,o),h=It(c,a);if(Hn.copy(i).invert(),e.boundsTree)return st(t,s,Mi),Mi.matrix.copy(Hn),Mi.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:M=>Mi.intersectsBox(M),intersectsTriangle:M=>{M.a.applyMatrix4(i),M.b.applyMatrix4(i),M.c.applyMatrix4(i),M.needsUpdate=!0;for(let T=E*3,x=(h+E)*3;T<x;T+=3)if(ct(An,T,p,l),An.needsUpdate=!0,M.intersectsTriangle(An))return!0;return!1}});for(let u=E*3,M=(h+E)*3;u<M;u+=3){ct(xn,u,p,l),xn.a.applyMatrix4(Hn),xn.b.applyMatrix4(Hn),xn.c.applyMatrix4(Hn),xn.needsUpdate=!0;for(let T=0,x=d.count;T<x;T+=3)if(ct(An,T,d,S),An.needsUpdate=!0,xn.intersectsTriangle(An))return!0}}else{const m=t+8,p=o[t+6];return st(m,s,Si),!!(r.intersectsBox(Si)&&Lr(m,n,e,i,r)||(st(p,s,Si),r.intersectsBox(Si)&&Lr(p,n,e,i,r)))}}const Ei=new ft,ur=new vt,zn=new vt,Th=new z,xh=new z,Ah=new z,yh=new z;function bh(t,n,e,i={},r={},s=0,a=1/0){n.boundingBox||n.computeBoundingBox(),ur.set(n.boundingBox.min,n.boundingBox.max,e),ur.needsUpdate=!0;const o=t.geometry,c=o.attributes.position,f=o.index,m=n.attributes.position,p=n.index,l=Ft.getPrimitive(),d=Ft.getPrimitive();let S=Th,E=xh,h=null,u=null;r&&(h=Ah,u=yh);let M=1/0,T=null,x=null;return Ei.copy(e).invert(),zn.matrix.copy(Ei),t.shapecast({boundsTraverseOrder:b=>ur.distanceToBox(b),intersectsBounds:(b,A,w)=>w<M&&w<a?(A&&(zn.min.copy(b.min),zn.max.copy(b.max),zn.needsUpdate=!0),!0):!1,intersectsRange:(b,A)=>{if(n.boundsTree)return n.boundsTree.shapecast({boundsTraverseOrder:R=>zn.distanceToBox(R),intersectsBounds:(R,_,g)=>g<M&&g<a,intersectsRange:(R,_)=>{for(let g=R,P=R+_;g<P;g++){ct(d,3*g,p,m),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let U=b,I=b+A;U<I;U++){ct(l,3*U,f,c),l.needsUpdate=!0;const B=l.distanceToTriangle(d,S,h);if(B<M&&(E.copy(S),u&&u.copy(h),M=B,T=U,x=g),B<s)return!0}}}});{const w=Fn(n);for(let R=0,_=w;R<_;R++){ct(d,3*R,p,m),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let g=b,P=b+A;g<P;g++){ct(l,3*g,f,c),l.needsUpdate=!0;const U=l.distanceToTriangle(d,S,h);if(U<M&&(E.copy(S),u&&u.copy(h),M=U,T=g,x=R),U<s)return!0}}}}}),Ft.releasePrimitive(l),Ft.releasePrimitive(d),M===1/0?null:(i.point?i.point.copy(E):i.point=E.clone(),i.distance=M,i.faceIndex=T,r&&(r.point?r.point.copy(u):r.point=u.clone(),r.point.applyMatrix4(Ei),E.applyMatrix4(Ei),r.distance=E.sub(r.point).length(),r.faceIndex=x),i)}function wh(t,n=null){n&&Array.isArray(n)&&(n=new Set(n));const e=t.geometry,i=e.index?e.index.array:null,r=e.attributes.position;let s,a,o,c,f=0;const m=t._roots;for(let l=0,d=m.length;l<d;l++)s=m[l],a=new Uint32Array(s),o=new Uint16Array(s),c=new Float32Array(s),p(0,f),f+=s.byteLength;function p(l,d,S=!1){const E=l*2;if(o[E+15]===Vi){const u=a[l+6],M=o[E+14];let T=1/0,x=1/0,b=1/0,A=-1/0,w=-1/0,R=-1/0;for(let _=u,g=u+M;_<g;_++){const P=3*t.resolveTriangleIndex(_);for(let U=0;U<3;U++){let I=P+U;I=i?i[I]:I;const B=r.getX(I),X=r.getY(I),G=r.getZ(I);B<T&&(T=B),B>A&&(A=B),X<x&&(x=X),X>w&&(w=X),G<b&&(b=G),G>R&&(R=G)}}return c[l+0]!==T||c[l+1]!==x||c[l+2]!==b||c[l+3]!==A||c[l+4]!==w||c[l+5]!==R?(c[l+0]=T,c[l+1]=x,c[l+2]=b,c[l+3]=A,c[l+4]=w,c[l+5]=R,!0):!1}else{const u=l+8,M=a[l+6],T=u+d,x=M+d;let b=S,A=!1,w=!1;n?b||(A=n.has(T),w=n.has(x),b=!A&&!w):(A=!0,w=!0);const R=b||A,_=b||w;let g=!1;R&&(g=p(u,d,b));let P=!1;_&&(P=p(M,d,b));const U=g||P;if(U)for(let I=0;I<3;I++){const B=u+I,X=M+I,G=c[B],ee=c[B+3],W=c[X],fe=c[X+3];c[l+I]=G<W?G:W,c[l+I+3]=ee>fe?ee:fe}return U}}}function Rh(t,n,e,i,r,s,a){Je.setBuffer(t._roots[n]),Ir(0,t,e,i,r,s,a),Je.clearBuffer()}function Ir(t,n,e,i,r,s,a){const{float32Array:o,uint16Array:c,uint32Array:f}=Je,m=t*2;if(Tt(m,c)){const l=Rt(t,f),d=It(m,c);mh(n,e,i,l,d,r,s,a)}else{const l=Dt(t);sn(l,o,i,s,a)&&Ir(l,n,e,i,r,s,a);const d=Nt(t,f);sn(d,o,i,s,a)&&Ir(d,n,e,i,r,s,a)}}const Ch=["x","y","z"];function Ph(t,n,e,i,r,s){Je.setBuffer(t._roots[n]);const a=Dr(0,t,e,i,r,s);return Je.clearBuffer(),a}function Dr(t,n,e,i,r,s){const{float32Array:a,uint16Array:o,uint32Array:c}=Je;let f=t*2;if(Tt(f,o)){const p=Rt(t,c),l=It(f,o);return gh(n,e,i,p,l,r,s)}else{const p=Qa(t,c),l=Ch[p],S=i.direction[l]>=0;let E,h;S?(E=Dt(t),h=Nt(t,c)):(E=Nt(t,c),h=Dt(t));const M=sn(E,a,i,r,s)?Dr(E,n,e,i,r,s):null;if(M){const b=M.point[l];if(S?b<=a[h+p]:b>=a[h+p+3])return M}const x=sn(h,a,i,r,s)?Dr(h,n,e,i,r,s):null;return M&&x?M.distance<=x.distance?M:x:M||x||null}}const Ti=new zt,yn=new Vt,bn=new Vt,Wn=new ft,pa=new vt,xi=new vt;function Uh(t,n,e,i){Je.setBuffer(t._roots[n]);const r=Nr(0,t,e,i);return Je.clearBuffer(),r}function Nr(t,n,e,i,r=null){const{float32Array:s,uint16Array:a,uint32Array:o}=Je;let c=t*2;if(r===null&&(e.boundingBox||e.computeBoundingBox(),pa.set(e.boundingBox.min,e.boundingBox.max,i),r=pa),Tt(c,a)){const m=n.geometry,p=m.index,l=m.attributes.position,d=e.index,S=e.attributes.position,E=Rt(t,o),h=It(c,a);if(Wn.copy(i).invert(),e.boundsTree)return st(t,s,xi),xi.matrix.copy(Wn),xi.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:M=>xi.intersectsBox(M),intersectsTriangle:M=>{M.a.applyMatrix4(i),M.b.applyMatrix4(i),M.c.applyMatrix4(i),M.needsUpdate=!0;for(let T=E,x=h+E;T<x;T++)if(ct(bn,3*n.resolveTriangleIndex(T),p,l),bn.needsUpdate=!0,M.intersectsTriangle(bn))return!0;return!1}});for(let u=E,M=h+E;u<M;u++){const T=n.resolveTriangleIndex(u);ct(yn,3*T,p,l),yn.a.applyMatrix4(Wn),yn.b.applyMatrix4(Wn),yn.c.applyMatrix4(Wn),yn.needsUpdate=!0;for(let x=0,b=d.count;x<b;x+=3)if(ct(bn,x,d,S),bn.needsUpdate=!0,yn.intersectsTriangle(bn))return!0}}else{const m=t+8,p=o[t+6];return st(m,s,Ti),!!(r.intersectsBox(Ti)&&Nr(m,n,e,i,r)||(st(p,s,Ti),r.intersectsBox(Ti)&&Nr(p,n,e,i,r)))}}const Ai=new ft,fr=new vt,Xn=new vt,Lh=new z,Ih=new z,Dh=new z,Nh=new z;function Fh(t,n,e,i={},r={},s=0,a=1/0){n.boundingBox||n.computeBoundingBox(),fr.set(n.boundingBox.min,n.boundingBox.max,e),fr.needsUpdate=!0;const o=t.geometry,c=o.attributes.position,f=o.index,m=n.attributes.position,p=n.index,l=Ft.getPrimitive(),d=Ft.getPrimitive();let S=Lh,E=Ih,h=null,u=null;r&&(h=Dh,u=Nh);let M=1/0,T=null,x=null;return Ai.copy(e).invert(),Xn.matrix.copy(Ai),t.shapecast({boundsTraverseOrder:b=>fr.distanceToBox(b),intersectsBounds:(b,A,w)=>w<M&&w<a?(A&&(Xn.min.copy(b.min),Xn.max.copy(b.max),Xn.needsUpdate=!0),!0):!1,intersectsRange:(b,A)=>{if(n.boundsTree){const w=n.boundsTree;return w.shapecast({boundsTraverseOrder:R=>Xn.distanceToBox(R),intersectsBounds:(R,_,g)=>g<M&&g<a,intersectsRange:(R,_)=>{for(let g=R,P=R+_;g<P;g++){const U=w.resolveTriangleIndex(g);ct(d,3*U,p,m),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let I=b,B=b+A;I<B;I++){const X=t.resolveTriangleIndex(I);ct(l,3*X,f,c),l.needsUpdate=!0;const G=l.distanceToTriangle(d,S,h);if(G<M&&(E.copy(S),u&&u.copy(h),M=G,T=I,x=g),G<s)return!0}}}})}else{const w=Fn(n);for(let R=0,_=w;R<_;R++){ct(d,3*R,p,m),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let g=b,P=b+A;g<P;g++){const U=t.resolveTriangleIndex(g);ct(l,3*U,f,c),l.needsUpdate=!0;const I=l.distanceToTriangle(d,S,h);if(I<M&&(E.copy(S),u&&u.copy(h),M=I,T=g,x=R),I<s)return!0}}}}}),Ft.releasePrimitive(l),Ft.releasePrimitive(d),M===1/0?null:(i.point?i.point.copy(E):i.point=E.clone(),i.distance=M,i.faceIndex=T,r&&(r.point?r.point.copy(u):r.point=u.clone(),r.point.applyMatrix4(Ai),E.applyMatrix4(Ai),r.distance=E.sub(r.point).length(),r.faceIndex=x),i)}function Oh(){return typeof SharedArrayBuffer<"u"}const ei=new Je.constructor,Fi=new Je.constructor,Jt=new Vr(()=>new zt),wn=new zt,Rn=new zt,dr=new zt,pr=new zt;let hr=!1;function Bh(t,n,e,i){if(hr)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");hr=!0;const r=t._roots,s=n._roots;let a,o=0,c=0;const f=new ft().copy(e).invert();for(let m=0,p=r.length;m<p;m++){ei.setBuffer(r[m]),c=0;const l=Jt.getPrimitive();st(0,ei.float32Array,l),l.applyMatrix4(f);for(let d=0,S=s.length;d<S&&(Fi.setBuffer(s[d]),a=Bt(0,0,e,f,i,o,c,0,0,l),Fi.clearBuffer(),c+=s[d].length,!a);d++);if(Jt.releasePrimitive(l),ei.clearBuffer(),o+=r[m].length,a)break}return hr=!1,a}function Bt(t,n,e,i,r,s=0,a=0,o=0,c=0,f=null,m=!1){let p,l;m?(p=Fi,l=ei):(p=ei,l=Fi);const d=p.float32Array,S=p.uint32Array,E=p.uint16Array,h=l.float32Array,u=l.uint32Array,M=l.uint16Array,T=t*2,x=n*2,b=Tt(T,E),A=Tt(x,M);let w=!1;if(A&&b)m?w=r(Rt(n,u),It(n*2,M),Rt(t,S),It(t*2,E),c,a+n,o,s+t):w=r(Rt(t,S),It(t*2,E),Rt(n,u),It(n*2,M),o,s+t,c,a+n);else if(A){const R=Jt.getPrimitive();st(n,h,R),R.applyMatrix4(e);const _=Dt(t),g=Nt(t,S);st(_,d,wn),st(g,d,Rn);const P=R.intersectsBox(wn),U=R.intersectsBox(Rn);w=P&&Bt(n,_,i,e,r,a,s,c,o+1,R,!m)||U&&Bt(n,g,i,e,r,a,s,c,o+1,R,!m),Jt.releasePrimitive(R)}else{const R=Dt(n),_=Nt(n,u);st(R,h,dr),st(_,h,pr);const g=f.intersectsBox(dr),P=f.intersectsBox(pr);if(g&&P)w=Bt(t,R,e,i,r,s,a,o,c+1,f,m)||Bt(t,_,e,i,r,s,a,o,c+1,f,m);else if(g)if(b)w=Bt(t,R,e,i,r,s,a,o,c+1,f,m);else{const U=Jt.getPrimitive();U.copy(dr).applyMatrix4(e);const I=Dt(t),B=Nt(t,S);st(I,d,wn),st(B,d,Rn);const X=U.intersectsBox(wn),G=U.intersectsBox(Rn);w=X&&Bt(R,I,i,e,r,a,s,c,o+1,U,!m)||G&&Bt(R,B,i,e,r,a,s,c,o+1,U,!m),Jt.releasePrimitive(U)}else if(P)if(b)w=Bt(t,_,e,i,r,s,a,o,c+1,f,m);else{const U=Jt.getPrimitive();U.copy(pr).applyMatrix4(e);const I=Dt(t),B=Nt(t,S);st(I,d,wn),st(B,d,Rn);const X=U.intersectsBox(wn),G=U.intersectsBox(Rn);w=X&&Bt(_,I,i,e,r,a,s,c,o+1,U,!m)||G&&Bt(_,B,i,e,r,a,s,c,o+1,U,!m),Jt.releasePrimitive(U)}}return w}const yi=new vt,ha=new zt,kh={strategy:Ya,maxDepth:40,maxLeafTris:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null};class Hr{static serialize(n,e={}){e={cloneBuffers:!0,...e};const i=n.geometry,r=n._roots,s=n._indirectBuffer,a=i.getIndex();let o;return e.cloneBuffers?o={roots:r.map(c=>c.slice()),index:a?a.array.slice():null,indirectBuffer:s?s.slice():null}:o={roots:r,index:a?a.array:null,indirectBuffer:s},o}static deserialize(n,e,i={}){i={setIndex:!0,indirect:!!n.indirectBuffer,...i};const{index:r,roots:s,indirectBuffer:a}=n,o=new Hr(e,{...i,[sr]:!0});if(o._roots=s,o._indirectBuffer=a||null,i.setIndex){const c=e.getIndex();if(c===null){const f=new _t(n.index,1,!1);e.setIndex(f)}else c.array!==r&&(c.array.set(r),c.needsUpdate=!0)}return o}get indirect(){return!!this._indirectBuffer}constructor(n,e={}){if(n.isBufferGeometry){if(n.index&&n.index.isInterleavedBufferAttribute)throw new Error("MeshBVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("MeshBVH: Only BufferGeometries are supported.");if(e=Object.assign({...kh,[sr]:!1},e),e.useSharedArrayBuffer&&!Oh())throw new Error("MeshBVH: SharedArrayBuffer is not available.");this.geometry=n,this._roots=null,this._indirectBuffer=null,e[sr]||(th(this,e),!n.boundingBox&&e.setBoundingBox&&(n.boundingBox=this.getBoundingBox(new zt))),this.resolveTriangleIndex=e.indirect?i=>this._indirectBuffer[i]:i=>i}refit(n=null){return(this.indirect?wh:hh)(this,n)}traverse(n,e=0){const i=this._roots[e],r=new Uint32Array(i),s=new Uint16Array(i);a(0);function a(o,c=0){const f=o*2,m=s[f+15]===Vi;if(m){const p=r[o+6],l=s[f+14];n(c,m,new Float32Array(i,o*4,6),p,l)}else{const p=o+Jn/4,l=r[o+6],d=r[o+7];n(c,m,new Float32Array(i,o*4,6),d)||(a(p,c+1),a(l,c+1))}}}raycast(n,e=mn,i=0,r=1/0){const s=this._roots,a=this.geometry,o=[],c=e.isMaterial,f=Array.isArray(e),m=a.groups,p=c?e.side:e,l=this.indirect?Rh:vh;for(let d=0,S=s.length;d<S;d++){const E=f?e[m[d].materialIndex].side:p,h=o.length;if(l(this,d,E,n,o,i,r),f){const u=m[d].materialIndex;for(let M=h,T=o.length;M<T;M++)o[M].face.materialIndex=u}}return o}raycastFirst(n,e=mn,i=0,r=1/0){const s=this._roots,a=this.geometry,o=e.isMaterial,c=Array.isArray(e);let f=null;const m=a.groups,p=o?e.side:e,l=this.indirect?Ph:Mh;for(let d=0,S=s.length;d<S;d++){const E=c?e[m[d].materialIndex].side:p,h=l(this,d,E,n,i,r);h!=null&&(f==null||h.distance<f.distance)&&(f=h,c&&(h.face.materialIndex=m[d].materialIndex))}return f}intersectsGeometry(n,e){let i=!1;const r=this._roots,s=this.indirect?Uh:Eh;for(let a=0,o=r.length;a<o&&(i=s(this,a,n,e),!i);a++);return i}shapecast(n){const e=Ft.getPrimitive(),i=this.indirect?_h:ph;let{boundsTraverseOrder:r,intersectsBounds:s,intersectsRange:a,intersectsTriangle:o}=n;if(a&&o){const p=a;a=(l,d,S,E,h)=>p(l,d,S,E,h)?!0:i(l,d,this,o,S,E,e)}else a||(o?a=(p,l,d,S)=>i(p,l,this,o,d,S,e):a=(p,l,d)=>d);let c=!1,f=0;const m=this._roots;for(let p=0,l=m.length;p<l;p++){const d=m[p];if(c=oh(this,p,s,a,r,f),c)break;f+=d.byteLength}return Ft.releasePrimitive(e),c}bvhcast(n,e,i){let{intersectsRanges:r,intersectsTriangles:s}=i;const a=Ft.getPrimitive(),o=this.geometry.index,c=this.geometry.attributes.position,f=this.indirect?S=>{const E=this.resolveTriangleIndex(S);ct(a,E*3,o,c)}:S=>{ct(a,S*3,o,c)},m=Ft.getPrimitive(),p=n.geometry.index,l=n.geometry.attributes.position,d=n.indirect?S=>{const E=n.resolveTriangleIndex(S);ct(m,E*3,p,l)}:S=>{ct(m,S*3,p,l)};if(s){const S=(E,h,u,M,T,x,b,A)=>{for(let w=u,R=u+M;w<R;w++){d(w),m.a.applyMatrix4(e),m.b.applyMatrix4(e),m.c.applyMatrix4(e),m.needsUpdate=!0;for(let _=E,g=E+h;_<g;_++)if(f(_),a.needsUpdate=!0,s(a,m,_,w,T,x,b,A))return!0}return!1};if(r){const E=r;r=function(h,u,M,T,x,b,A,w){return E(h,u,M,T,x,b,A,w)?!0:S(h,u,M,T,x,b,A,w)}}else r=S}return Bh(this,n,e,r)}intersectsBox(n,e){return yi.set(n.min,n.max,e),yi.needsUpdate=!0,this.shapecast({intersectsBounds:i=>yi.intersectsBox(i),intersectsTriangle:i=>yi.intersectsTriangle(i)})}intersectsSphere(n){return this.shapecast({intersectsBounds:e=>n.intersectsBox(e),intersectsTriangle:e=>e.intersectsSphere(n)})}closestPointToGeometry(n,e,i={},r={},s=0,a=1/0){return(this.indirect?Fh:bh)(this,n,e,i,r,s,a)}closestPointToPoint(n,e={},i=0,r=1/0){return ch(this,n,e,i,r)}getBoundingBox(n){return n.makeEmpty(),this._roots.forEach(i=>{st(0,new Float32Array(i),ha),n.union(ha)}),n}}const bi={low:{particleBudget:Math.floor(at.PARTICLE_COUNT*.45),spawnBatch:Math.max(20,Math.floor(at.PARTICLE_SPAWN_COUNT*.55)),gpuUpdateInterval:1/35},medium:{particleBudget:Math.floor(at.PARTICLE_COUNT*.7),spawnBatch:Math.max(40,Math.floor(at.PARTICLE_SPAWN_COUNT*.8)),gpuUpdateInterval:1/50},high:{particleBudget:at.PARTICLE_COUNT,spawnBatch:at.PARTICLE_SPAWN_COUNT,gpuUpdateInterval:0}};class Gh{constructor(n){N(this,"_dummy",new Ba);N(this,"_tempColor",new Pe);N(this,"particleSystem",null);N(this,"particleInstancedMesh",null);N(this,"particleCursor",0);N(this,"instanceFreeStack",[]);N(this,"instanceStartTimes",null);N(this,"instanceLifetimes",null);N(this,"featureVisuals");N(this,"featureCooldowns",{});N(this,"ambientAccumulator",0);N(this,"spawnOrigin",new z);N(this,"spawnForward",new z);N(this,"spawnRight",new z);N(this,"spawnUp",new z);N(this,"worldUp",new z(0,1,0));N(this,"spawnWork",new z);N(this,"texSize");N(this,"synestheticSettings",null);N(this,"consciousParticles",[]);N(this,"consciousIdCounter",0);N(this,"synapticGeometry",null);N(this,"synapticMaterial",null);N(this,"synapticLines",null);N(this,"maxSynapticLinks",128);N(this,"synapticColorA",new Pe("#7adfff"));N(this,"synapticColorB",new Pe("#ff9efc"));N(this,"synapticTemp",new z);N(this,"synestheticUniforms",{neuralGain:.65,resonanceFloor:.35,persistence:.6});N(this,"consciousnessIntensity",.9);N(this,"gpuEnabled",!1);N(this,"gpuRenderer",null);N(this,"gpuPosRTA",null);N(this,"gpuPosRTB",null);N(this,"gpuVelRTA",null);N(this,"gpuVelRTB",null);N(this,"gpuQuadScene",null);N(this,"gpuQuadCamera",null);N(this,"gpuVelMaterial",null);N(this,"gpuPosMaterial",null);N(this,"gpuVelQuad",null);N(this,"gpuPosQuad",null);N(this,"gpuSwap",!1);N(this,"rendererInfo",null);N(this,"qualityLevel","high");N(this,"particleBudget",bi.high.particleBudget);N(this,"spawnBatchSize",bi.high.spawnBatch);N(this,"gpuUpdateInterval",bi.high.gpuUpdateInterval);N(this,"gpuUpdateAccumulator",0);N(this,"pendingUniforms",new Map);N(this,"_frameSpawnCount",0);N(this,"_maxFrameSpawns",200);this.scene=n,this.texSize=Math.ceil(Math.sqrt(at.PARTICLE_COUNT)),this.featureVisuals=new Map([["subBass",{color:[1,.2,.1],sensitivity:1.2,size:2.5,lifetime:3.5,behavior:"flow"}],["bass",{color:[1,.4,.2],sensitivity:1,size:2,lifetime:3,behavior:"flow"}],["lowMid",{color:[.2,.8,1],sensitivity:.9,size:1.2,lifetime:2.5,behavior:"burst"}],["mid",{color:[.5,1,.8],sensitivity:.8,size:1,lifetime:2,behavior:"burst"}],["highMid",{color:[.8,1,.6],sensitivity:.7,size:.8,lifetime:1.8,behavior:"trail"}],["treble",{color:[1,.8,.8],sensitivity:.6,size:.6,lifetime:1.5,behavior:"trail"}],["sparkle",{color:[1,1,1],sensitivity:.65,size:.7,lifetime:1.2,behavior:"trail"}]]),this.buildParticleMeshes(),this.setQualityProfile(this.qualityLevel),this.applyConsciousUniforms(),this.setConsciousnessIntensity(this.consciousnessIntensity)}beginFrame(){this._frameSpawnCount=0}get instancedMesh(){return this.particleInstancedMesh}get points(){return this.particleSystem}registerFeatureVisual(n,e){const i=this.featureVisuals.get(n);if(i){this.featureVisuals.set(n,{...i,...e});return}const r={color:[1,1,1],sensitivity:1,size:1,lifetime:2,behavior:"burst",...e};this.featureVisuals.set(n,r)}applyConsciousUniforms(){this.applyShaderUniform("neuralGain",this.synestheticUniforms.neuralGain),this.applyShaderUniform("resonanceFloor",this.synestheticUniforms.resonanceFloor),this.applyShaderUniform("consciousnessPersistence",this.synestheticUniforms.persistence)}syncInstancedConsciousUniform(n){if(!this.particleInstancedMesh)return;const e=this.particleInstancedMesh.material;if(!e||!e.uniforms)return;const i=n??this.consciousnessIntensity;this.updateScalarUniform(e.uniforms.consciousnessIntensity,i,.001)}setConsciousnessIntensity(n){const e=Ee.clamp(n,.2,3);Math.abs(e-this.consciousnessIntensity)>.001?this.consciousnessIntensity=e:this.consciousnessIntensity=e,this.applyShaderUniform("consciousnessDrive",this.consciousnessIntensity),this.syncInstancedConsciousUniform()}updateScalarUniform(n,e,i=.001){if(!n)return;const r=typeof n.value=="number"?n.value:Number(n.value);(!Number.isFinite(r)||Math.abs(r-e)>i)&&(n.value=e)}setQualityProfile(n){const e=bi[n];if(!e)return;const i=Math.max(1,Math.min(e.particleBudget,at.PARTICLE_COUNT)),r=Math.max(1,Math.min(e.spawnBatch,i)),s=Math.max(0,e.gpuUpdateInterval);this.qualityLevel===n&&this.particleBudget===i&&this.spawnBatchSize===r&&Math.abs(this.gpuUpdateInterval-s)<1e-6||(this.qualityLevel=n,this.particleBudget=i,this.spawnBatchSize=r,this.gpuUpdateInterval=s,this._maxFrameSpawns=Math.max(100,Math.floor(this.particleBudget*.1)),this.particleCursor>=this.particleBudget&&(this.particleCursor=this.particleBudget>0?this.particleCursor%this.particleBudget:0),this.particleInstancedMesh&&(this.particleInstancedMesh.count=this.particleBudget,this.particleInstancedMesh.instanceMatrix.needsUpdate=!0,this.hideInstancesBeyondBudget()),this.rebuildFreeStackForBudget(),this.enforceBudgetOnPointsGeometry())}setConsciousnessSettings(n){if(!n){this.synestheticSettings=null,this.consciousParticles=[],this.fadeSynapticNetwork(!0),this.synestheticUniforms={neuralGain:.6,resonanceFloor:.3,persistence:.55},this.applyConsciousUniforms(),this.setConsciousnessIntensity(.8);return}const e=(a,o,c=0,f=1)=>Number.isFinite(a)?Ee.clamp(a,c,f):Ee.clamp(o,c,f),i=e(n.connectionDensity??.45,.45),r=e(n.resonanceThreshold??.4,.2),s=e(n.persistence??.55,0,1);this.synestheticSettings={connectionDensity:i,resonanceThreshold:r,lifespanSeconds:Math.max(.5,n.lifespanSeconds??4),persistence:s},this.synestheticUniforms={neuralGain:Ee.clamp(.55+i*.85,.4,1.6),resonanceFloor:Ee.clamp(r,.05,.95),persistence:s},this.applyConsciousUniforms(),this.setConsciousnessIntensity(.95+i*.4)}applyShaderUniform(n,e){var r;if(this.pendingUniforms.set(n,e),!this.gpuEnabled)return;const i=[this.gpuVelMaterial,this.gpuPosMaterial];for(const s of i){const a=(r=s==null?void 0:s.uniforms)==null?void 0:r[n];a&&(typeof e=="number"?this.updateScalarUniform(a,e):a.value=e)}}rebuildFreeStackForBudget(){if(!this.instanceLifetimes||!this.instanceStartTimes){this.instanceFreeStack=[];return}const n=this.instanceLifetimes.length;for(let r=this.particleBudget;r<n;r++)this.instanceLifetimes[r]=0,this.instanceStartTimes[r]=0;const e=[],i=Math.min(this.particleBudget,n);for(let r=i-1;r>=0;r--)this.instanceLifetimes[r]<=0&&e.push(r);this.instanceFreeStack=e}hideInstancesBeyondBudget(){if(!this.particleInstancedMesh||this.particleBudget>=at.PARTICLE_COUNT)return;const n=this._dummy;for(let e=this.particleBudget;e<at.PARTICLE_COUNT;e++)n.position.set(0,-9999,0),n.scale.setScalar(0),n.updateMatrix(),this.particleInstancedMesh.setMatrixAt(e,n.matrix);this.particleInstancedMesh.instanceMatrix.needsUpdate=!0}enforceBudgetOnPointsGeometry(){if(!this.particleSystem)return;const n=this.particleSystem.geometry,e=n.getAttribute("position"),i=n.getAttribute("velocity"),r=n.getAttribute("startTime");if(!e)return;const s=Math.min(this.particleBudget,e.count);if(s<e.count){for(let a=s;a<e.count;a++){const o=a*3;e.array[o+0]=0,e.array[o+1]=-9999,e.array[o+2]=0,i&&(i.array[o+0]=0,i.array[o+1]=0,i.array[o+2]=0),r&&(r.array[a]=0)}e.updateRange={offset:s*3,count:(e.count-s)*3},e.needsUpdate=!0,i&&(i.updateRange={offset:s*3,count:(i.count-s)*3},i.needsUpdate=!0),r&&(r.updateRange={offset:s,count:r.count-s},r.needsUpdate=!0)}}applyPendingUniforms(){var e;if(!this.gpuEnabled||!this.pendingUniforms.size)return;const n=[this.gpuVelMaterial,this.gpuPosMaterial];for(const[i,r]of this.pendingUniforms.entries())for(const s of n){const a=(e=s==null?void 0:s.uniforms)==null?void 0:e[i];a&&(typeof r=="number"?this.updateScalarUniform(a,r):a.value=r)}}updateConsciousness(n){if(!this.synestheticSettings){this.fadeSynapticNetwork(!1),this.setConsciousnessIntensity(Ee.lerp(this.consciousnessIntensity,.75,.12));return}if(this.ensureSynapticNetwork(),!this.synapticGeometry||!this.synapticMaterial)return;const e=this.synestheticSettings,i=Math.max(.5,e.lifespanSeconds??4),r=Ee.clamp(e.persistence??.55,0,1),s=[];let a=0;for(const g of this.consciousParticles){const P=n.nowSeconds-g.createdAt;if(P>g.lifespan||P>i)continue;const U=Math.max(0,Math.min(1,(n.audioFeatures[g.featureKey]||0)*n.segmentIntensityBoost));g.resonance=Ee.lerp(g.resonance,U,.18),a+=g.resonance,g.velocity.multiplyScalar(.92),g.velocity.addScaledVector(this.worldUp,(U-.45)*.05),this.synapticTemp.set((Math.random()-.5)*.025,0,(Math.random()-.5)*.025),g.velocity.add(this.synapticTemp),g.position.add(g.velocity),s.push(g)}this.consciousParticles=s;const o=this.synapticGeometry,c=o.getAttribute("position"),f=o.getAttribute("color");if(!c||!f)return;const m=Ee.clamp(e.connectionDensity??.45,0,1),p=Ee.clamp(e.resonanceThreshold??.4,0,1),l=Math.max(0,Math.min(this.maxSynapticLinks,Math.round(this.maxSynapticLinks*m))),d=this.consciousParticles.length;let S=0;const E=this.synapticColorA.r,h=this.synapticColorA.g,u=this.synapticColorA.b,M=this.synapticColorB.r,T=this.synapticColorB.g,x=this.synapticColorB.b;if(l>0&&d>=2)for(let g=0;g<d&&S<l;g++){const P=this.consciousParticles[g];for(let U=g+1;U<d&&S<l;U++){const I=this.consciousParticles[U],B=(P.resonance+I.resonance)*.5;if(B<p||P.position.distanceTo(I.position)>28)continue;const G=S*6;c.array[G+0]=P.position.x,c.array[G+1]=P.position.y,c.array[G+2]=P.position.z,c.array[G+3]=I.position.x,c.array[G+4]=I.position.y,c.array[G+5]=I.position.z;const ee=Ee.lerp(E,M,B),W=Ee.lerp(h,T,B),fe=Ee.lerp(u,x,B);f.array[G+0]=ee,f.array[G+1]=W,f.array[G+2]=fe,f.array[G+3]=ee,f.array[G+4]=W,f.array[G+5]=fe,S++}}if(o.setDrawRange(0,S*2),c.needsUpdate=S>0,f.needsUpdate=S>0,this.synapticMaterial&&this.synapticLines){const g=S>0?Math.min(1,.25+S/Math.max(1,l)*.75):0;this.synapticMaterial.opacity=Ee.lerp(this.synapticMaterial.opacity,g,S>0?.18:(1-r)*.12+.02),this.synapticLines.visible=this.synapticMaterial.opacity>.02}const b=d>0?a/d:0,A=l>0?S/l:0,w=m,R=Ee.clamp(.45+b*1.2+A*.9+w*.6,.3,2.5),_=Ee.lerp(this.consciousnessIntensity,R,S>0?.25:.12*(1-r));this.setConsciousnessIntensity(_)}ensureSynapticNetwork(){if(this.synapticLines&&this.synapticGeometry&&this.synapticMaterial)return;const n=new gn,e=new Float32Array(this.maxSynapticLinks*2*3),i=new Float32Array(this.maxSynapticLinks*2*3);n.setAttribute("position",new _t(e,3)),n.setAttribute("color",new _t(i,3)),n.setDrawRange(0,0);const r=new Nc({transparent:!0,opacity:0,vertexColors:!0,blending:rn,depthWrite:!1}),s=new Fc(n,r);s.frustumCulled=!1,s.renderOrder=11,this.scene.add(s),this.synapticGeometry=n,this.synapticMaterial=r,this.synapticLines=s}fadeSynapticNetwork(n){if(!(!this.synapticMaterial||!this.synapticGeometry||!this.synapticLines)){if(n){this.synapticMaterial.opacity=0,this.synapticLines.visible=!1,this.synapticGeometry.setDrawRange(0,0);return}this.synapticMaterial.opacity=Ee.lerp(this.synapticMaterial.opacity,0,.12),this.synapticMaterial.opacity<.02&&(this.synapticLines.visible=!1,this.synapticGeometry.setDrawRange(0,0))}}driveReactiveParticles(n,e){if(n.currentLOD==="low"||!this.particleInstancedMesh&&!this.particleSystem)return this.updateConsciousness({nowSeconds:n.nowSeconds,audioFeatures:n.audioFeatures,segmentIntensityBoost:n.segmentIntensityBoost}),e;const{nowSeconds:i,deltaSeconds:r,cameraPosition:s,lookAtPosition:a,audioFeatures:o,segmentIntensityBoost:c}=n;if(this.spawnForward.subVectors(a,s),this.spawnForward.lengthSq()<1e-6)return e;this.spawnForward.normalize(),this.spawnRight.copy(this.spawnForward).cross(this.worldUp),this.spawnRight.lengthSq()<1e-6?this.spawnRight.set(1,0,0):this.spawnRight.normalize(),this.spawnUp.copy(this.spawnRight).cross(this.spawnForward),this.spawnUp.lengthSq()<1e-6?this.spawnUp.copy(this.worldUp):this.spawnUp.normalize(),this.spawnOrigin.copy(s).addScaledVector(this.spawnForward,8).addScaledVector(this.spawnUp,2);const f=[{feature:"bass",threshold:.35,cooldown:.16,lateral:-2.8,forward:.5},{feature:"mid",threshold:.32,cooldown:.22,lateral:2.8,forward:1.8},{feature:"treble",threshold:.28,cooldown:.28,lateral:.4,forward:3.8},{feature:"sparkle",threshold:.3,cooldown:.18,lateral:0,forward:0}];for(const m of f){const p=o[m.feature]??0;if(p<=0)continue;const l=this.featureVisuals.get(m.feature);if(!l)continue;const d=l.sensitivity,S=Math.min(1,p*d*c);if(S<m.threshold)continue;const E=this.featureCooldowns[m.feature]??0;if(i-E<m.cooldown)continue;this.spawnWork.copy(this.spawnOrigin).addScaledVector(this.spawnRight,m.lateral+(Math.random()-.5)*1.5).addScaledVector(this.spawnForward,m.forward+(Math.random()-.5)*1),this.spawnFeatureBurst(m.feature,S,this.spawnWork,o,c,i),this.featureCooldowns[m.feature]=i;const h=m.feature==="bass"||m.feature==="subBass"?S*.9:S*.45;e=Math.min(1.5,e+h)}if(this.ambientAccumulator+=r*(1.1+n.gpuAudioForce*.8),this.ambientAccumulator>=.45){const m=Math.max(1,Math.floor(this.ambientAccumulator/.45));this.ambientAccumulator-=m*.45;for(let p=0;p<m;p++)this.spawnWork.copy(this.spawnOrigin).addScaledVector(this.spawnForward,1.2+(Math.random()-.5)*1.5).addScaledVector(this.spawnRight,(Math.random()-.5)*3.5),this.spawnFeatureBurst("sparkle",.45+Math.random()*.4,this.spawnWork,o,c,i),e=Math.min(1.5,e+.25)}return this.updateConsciousness({nowSeconds:i,audioFeatures:o,segmentIntensityBoost:c}),e}spawnParticles(n,e){if(!this.particleSystem)return;const{origin:i,feature:r,audioFeatures:s,segmentIntensityBoost:a,nowSeconds:o}=e,c=this.spawnBatchSize,f=n>0?Math.min(n,c):c;if(this.particleInstancedMesh){this.spawnInstanceBatch(f,e,o);return}this.spawnPointsBatch(f,i,r,s,a,o)}spawnFeatureBurst(n,e,i,r,s,a){const o=Math.max(0,Math.min(1,e)),c=this.spawnBatchSize,f=Math.max(1,Math.round(c*(.5+o*2)));this.spawnParticles(f,{origin:i,feature:n,audioFeatures:r,segmentIntensityBoost:s,nowSeconds:a}),this.registerConsciousParticle(n,i,o,s,a)}seedAmbientField(n,e,i,r,s,a){if(!n||e<=0||i<=0)return;const o=Math.max(1,e),c=["sparkle","highMid","mid","lowMid","treble"],f=this.spawnForward,m=this.spawnRight,p=this.spawnUp,l=this.spawnWork;for(let d=0;d<o;d++){const S=(d+Math.random()*.35)/o;n.getPointAt(S%1,l),n.getTangentAt(S%1,f),f.lengthSq()<1e-6&&f.set(0,0,1),m.copy(this.worldUp).cross(f).normalize(),m.lengthSq()<1e-6&&m.set(1,0,0),p.copy(f).cross(m).normalize();const E=i*(.4+Math.random()*.8),h=(Math.random()-.5)*E,u=(Math.random()-.5)*E*.6,M=(Math.random()-.5)*E*.45;l.addScaledVector(m,h),l.addScaledVector(p,u),l.addScaledVector(f,M);const T=c[d%c.length],x=.45+Math.random()*.55;this.spawnFeatureBurst(T,x,l,s,a,r-Math.random()*2.5)}}reclaimExpired(n){if(!this.particleInstancedMesh||!this.instanceStartTimes||!this.instanceLifetimes)return;const e=this._dummy,i=this.particleInstancedMesh.count;let r=0;for(let s=0;s<i;s++){const a=this.instanceStartTimes[s],o=this.instanceLifetimes[s];o>0&&n-a>=o&&(this.freeInstance(s),e.position.set(0,0,0),e.scale.setScalar(0),e.updateMatrix(),this.particleInstancedMesh.setMatrixAt(s,e.matrix),r++)}r>0&&(this.particleInstancedMesh.instanceMatrix.needsUpdate=!0)}updatePointsMaterial(n,e,i,r){if(this.particleSystem)try{const s=this.particleSystem.material,a=n.bass||0,o=.7+this.consciousnessIntensity*.25+e*.12,c=at.PARTICLE_BASE_SIZE*(1+a*1.2*e)*o;s.size=Ee.lerp(s.size||at.PARTICLE_BASE_SIZE,c,.06);const f=this._tempColor.copy(i).lerp(r,.45),m=Math.min(.65,this.consciousnessIntensity*.28);m>.001&&f.lerp(this.synapticColorB,m),s.color.lerp(f,.02),s.needsUpdate=!0}catch{}}applyLOD(n){n==="low"?(this.particleInstancedMesh&&(this.particleInstancedMesh.visible=!1),this.particleSystem&&!this.particleSystem.parent&&this.scene.add(this.particleSystem),this.particleSystem&&(this.particleSystem.visible=!0)):(this.particleInstancedMesh&&(this.particleInstancedMesh.visible=!0),this.particleSystem&&this.particleSystem.parent===this.scene&&this.scene.remove(this.particleSystem),this.particleSystem&&(this.particleSystem.visible=!1))}switchToFallback(){console.warn("[VisualEffects] Switching to fallback particle system (THREE.Points)."),this.particleInstancedMesh&&(this.particleInstancedMesh.visible=!1),this.particleSystem&&(this.particleSystem.parent||this.scene.add(this.particleSystem),this.particleSystem.visible=!0)}dispose(){if(this.particleInstancedMesh){try{this.scene.remove(this.particleInstancedMesh),this.particleInstancedMesh.geometry.dispose(),this.particleInstancedMesh.material.dispose()}catch{}this.particleInstancedMesh=null}if(this.particleSystem){try{this.scene.remove(this.particleSystem),this.particleSystem.geometry.dispose(),this.particleSystem.material.dispose()}catch{}this.particleSystem=null}if(this.synapticLines){try{this.scene.remove(this.synapticLines),this.synapticLines.geometry.dispose()}catch{}if(this.synapticMaterial)try{this.synapticMaterial.dispose()}catch{}this.synapticGeometry=null,this.synapticMaterial=null,this.synapticLines=null}this.disposeGPU()}isGPUEnabled(){return this.gpuEnabled}validateParticleLayout(){if(!this.particleInstancedMesh)return!1;const n=at.PARTICLE_COUNT,e=this.particleInstancedMesh.count,i=Math.ceil(Math.sqrt(n)),r=i*i;return e!==n?(console.error(`[ParticleSystem] Instance count mismatch: expected ${n}, got ${e}`),!1):r<n?(console.error(`[ParticleSystem] Texture too small: ${i}x${i} (${r}) < ${n}`),!1):!0}detectRenderer(){if(this.rendererInfo!==null)return this.rendererInfo;try{const n=document.createElement("canvas"),e=n.getContext("webgl2")||n.getContext("webgl");if(!e)return this.rendererInfo={ok:!1,renderer:"no-webgl",vendor:"unknown"},this.rendererInfo;const i=e.getExtension&&e.getExtension("WEBGL_debug_renderer_info"),r=i?e.getParameter(i.UNMASKED_RENDERER_WEBGL):e.getParameter(e.RENDERER),s=i?e.getParameter(i.UNMASKED_VENDOR_WEBGL):e.getParameter(e.VENDOR);return this.rendererInfo={ok:!0,renderer:r||"unknown",vendor:s||"unknown"},this.rendererInfo}catch{return this.rendererInfo={ok:!1,renderer:"error",vendor:"error"},this.rendererInfo}}validateFloatRenderTargets(n){const e=n.getContext();if(!(typeof WebGL2RenderingContext<"u"&&e instanceof WebGL2RenderingContext))return console.warn("[GPU Particles] WebGL2 is not available."),!1;if(!e.getExtension("EXT_color_buffer_float"))return console.warn("[GPU Particles] EXT_color_buffer_float extension is not available."),!1;const s=new kt(1,1,{format:bt,type:Gt});try{n.setRenderTarget(s);const a=e.checkFramebufferStatus(e.FRAMEBUFFER);n.setRenderTarget(null),s.dispose();const o=a===e.FRAMEBUFFER_COMPLETE;return o||console.warn(`[GPU Particles] Float render target framebuffer check failed with status: ${a}.`),o}catch(a){return console.error("[GPU Particles] Error during float render target validation:",a),s.dispose(),!1}}disposeGPU(){this.gpuPosRTA&&(this.gpuPosRTA.dispose(),this.gpuPosRTA=null),this.gpuPosRTB&&(this.gpuPosRTB.dispose(),this.gpuPosRTB=null),this.gpuVelRTA&&(this.gpuVelRTA.dispose(),this.gpuVelRTA=null),this.gpuVelRTB&&(this.gpuVelRTB.dispose(),this.gpuVelRTB=null),this.gpuVelMaterial&&(this.gpuVelMaterial.dispose(),this.gpuVelMaterial=null),this.gpuPosMaterial&&(this.gpuPosMaterial.dispose(),this.gpuPosMaterial=null),this.gpuQuadScene&&(this.gpuQuadScene.clear(),this.gpuQuadScene=null),this.gpuQuadCamera&&(this.gpuQuadCamera=null),this.gpuVelQuad&&(this.gpuVelQuad.geometry.dispose(),this.gpuVelQuad=null),this.gpuPosQuad&&(this.gpuPosQuad.geometry.dispose(),this.gpuPosQuad=null),this.gpuRenderer=null,this.gpuEnabled=!1}async initGPU(n,e){const i=this.particleInstancedMesh;if(!i){console.log("[GPU Particles] No instanced mesh available, skipping GPU init.");return}if(!this.validateFloatRenderTargets(n)){const r=this.detectRenderer();console.warn(`[GPU Particles] GPU particle system requires WebGL2 + float render-target support. Falling back to CPU particles. renderer=${r.renderer}, vendor=${r.vendor}`),this.switchToFallback();return}try{this.gpuRenderer=n;const r=this.texSize;let s=ci("/shaders/velFrag.resolved.glsl"),a=ci("/shaders/posFrag.resolved.glsl");if(!s)try{const R=await fetch("/shaders/velFrag.resolved.glsl");R.ok&&(s=await R.text())}catch{}if(!a)try{const R=await fetch("/shaders/posFrag.resolved.glsl");R.ok&&(a=await R.text())}catch{}let o=ci("/shaders/baseVelFrag.glsl")||"",c=ci("/shaders/basePosFrag.glsl")||"";if((!s||!a)&&(!o||!c))try{if(!o){const R=await fetch("/shaders/baseVelFrag.glsl");R.ok&&(o=await R.text())}if(!c){const R=await fetch("/shaders/basePosFrag.glsl");R.ok&&(c=await R.text())}}catch{}let f=Oc();if(!f&&(!s||!a))try{try{const _=await import(window.location.origin+"/lygia/resolve.esm.js");f=_&&(_.default||_.resolveLygia||_.resolve)?_.default||_.resolveLygia||_.resolve:null}catch{f=null}}catch{try{const g=await import("https://lygia.xyz/resolve.esm.js");f=g&&(g.default||g.resolveLygia||g.resolve)?g.default||g.resolveLygia||g.resolve:null}catch{f=null}}const m=r*r,p=new Float32Array(m*4),l=new Float32Array(m*4),d=new ft,S=new z;for(let R=0;R<at.PARTICLE_COUNT;R++){const _=R*4;let g=0;try{i?(i.getMatrixAt(R,d),d.multiplyMatrices(i.matrixWorld,d),S.setFromMatrixPosition(d)):S.set(0,-9999,0),i&&i.geometry.getAttribute("instanceSpeed")&&(g=i.geometry.getAttribute("instanceSpeed").array[R]||0)}catch{S.set(0,-9999,0)}p[_+0]=S.x,p[_+1]=S.y,p[_+2]=S.z,p[_+3]=1,l[_+0]=g,l[_+1]=0,l[_+2]=0,l[_+3]=0}const E=new Us(p,r,r,bt,Gt);E.needsUpdate=!0;for(let R=0;R<m;R++)l[R*4+0]=0,l[R*4+1]=0,l[R*4+2]=0,l[R*4+3]=0;const h=new Us(l,r,r,bt,Gt);h.needsUpdate=!0,this.gpuQuadScene=new Oa,this.gpuQuadCamera=new Na(-1,1,1,-1,0,1),o||(o=`
      precision highp float; varying vec2 vUv;
      uniform sampler2D prevVel; uniform sampler2D prevPos; uniform float dt; uniform float time;
    uniform float audioForce; uniform float subBass; uniform float bass; uniform float lowMid; uniform float mid; uniform float highMid; uniform float treble; uniform float sparkle;
    uniform float neuralGain; uniform float resonanceFloor; uniform float consciousnessPersistence; uniform float consciousnessDrive;
              vec3 hash3(vec2 p) {
                vec3 q = vec3( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)), dot(p,vec2(419.2,371.9)) );
                return fract(sin(q) * 43758.5453);
              }
              float noise(vec2 p) {
                vec2 i = floor(p); vec2 f = fract(p);
                vec3 a = hash3(i + vec2(0.0,0.0));
                vec3 b = hash3(i + vec2(1.0,0.0));
                vec3 c = hash3(i + vec2(0.0,1.0));
                vec3 d = hash3(i + vec2(1.0,1.0));
                vec2 u = f*f*(3.0-2.0*f);
                return mix(mix(a.x,b.x,u.x), mix(c.x,d.x,u.x), u.y);
              }
              uniform float noiseScale;
              uniform float noiseSpeed;
              uniform float curlStrength;
              vec3 curlNoise(vec3 p){
                float n1 = noise(p.xy * noiseScale + time * noiseSpeed);
                float n2 = noise(p.yz * noiseScale + time * noiseSpeed * 1.1);
                float n3 = noise(p.zx * noiseScale + time * noiseSpeed * 0.95);
                return normalize(vec3(n2 - n3, n3 - n1, n1 - n2));
              }
              void main(){
                vec3 v = texture2D(prevVel, vUv).rgb;
                vec3 p = texture2D(prevPos, vUv).rgb;
                vec3 accel = vec3(0.0, -0.98, 0.0);
                v += accel * dt;
                  float bandPulse = clamp((sin(time*10.0 + vUv.x*50.0) * 0.5 + 0.5), 0.0, 1.0);
                  float audio = bandPulse * audioForce;
                  audio += subBass * 3.0;
                  audio += bass * 2.0;
                  audio += lowMid * 1.4;
                  audio += mid * 1.2;
                  audio += highMid * 1.0;
                  audio += treble * 0.8;
                  audio += sparkle * 0.6;
                  v.y += audio * 2.5;
                  float harmonicEnergy = max(resonanceFloor, subBass * 0.6 + bass * 0.8 + mid * 0.5 + sparkle * 0.35);
                  float neural = neuralGain * (audioForce * 0.12 + harmonicEnergy);
                  float drive = clamp(consciousnessDrive, 0.0, 3.0);
                  neural *= (0.6 + drive * 0.4);
                  vec3 c = curlNoise(p + v * 0.35 + vec3(time * 0.1, 0.0, 0.0));
                  v += c * curlStrength * (0.5 + harmonicEnergy * 0.6);
                  v.y += neural * 1.8;
                  v += normalize(c + vec3(0.0, harmonicEnergy * 0.4, 0.0)) * neural * 0.35;
                float damping = mix(0.982, 0.998, clamp(consciousnessPersistence, 0.0, 1.0));
                v *= damping;
                gl_FragColor = vec4(v, 1.0);
              }
            `),s&&s.includes("#include")&&(s=null),s&&["subBass","lowMid","highMid","sparkle"].some(g=>!new RegExp(`uniform\\s+float\\s+${g}\\b`).test(s))&&(console.warn("[GPU Particles] Resolved velocity shader missing expected audio uniforms; falling back to base shader."),s=null),a&&a.includes("#include")&&(a=null);let M=o;if(s)M=s;else if(f)try{const _=f(`#include "lygia/generative/simplex.glsl"
#include "lygia/generative/curl.glsl"
#include "lygia/color/palettes.glsl"
`+o);typeof _=="string"&&_.length>32&&!_.includes("Path ")&&!_.toLowerCase().includes("not found")&&(_.includes("void main")||_.includes("gl_FragColor")||_.includes("gl_FragData"))?M=_:M=o}catch{M=o}const T=new Ct({uniforms:{prevVel:{value:h},prevPos:{value:E},audioForce:{value:0},curlStrength:{value:e.curlStrength},noiseScale:{value:e.noiseScale},noiseSpeed:{value:e.noiseSpeed},subBass:{value:0},bass:{value:0},lowMid:{value:0},mid:{value:0},highMid:{value:0},treble:{value:0},sparkle:{value:0},neuralGain:{value:this.synestheticUniforms.neuralGain},resonanceFloor:{value:this.synestheticUniforms.resonanceFloor},consciousnessPersistence:{value:this.synestheticUniforms.persistence},consciousnessDrive:{value:this.consciousnessIntensity},time:{value:0},dt:{value:1/60},texSize:{value:r}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }",fragmentShader:M,depthTest:!1,depthWrite:!1});c||(c=`
              precision highp float; varying vec2 vUv;
              uniform sampler2D prevPos; uniform sampler2D velTex; uniform float dt;
              void main(){
                vec3 p = texture2D(prevPos, vUv).rgb;
                vec3 v = texture2D(velTex, vUv).rgb;
                p += v * dt;
                if (p.y < -100.0) p.y = -9999.0;
                gl_FragColor = vec4(p, 1.0);
              }
            `);let b=c;if(a)b=a;else if(f)try{const _=f(`#include "lygia/generative/simplex.glsl"
`+c);typeof _=="string"&&_.length>32&&!_.includes("Path ")&&!_.toLowerCase().includes("not found")&&(_.includes("void main")||_.includes("gl_FragColor")||_.includes("gl_FragData"))?b=_:b=c}catch{b=c}const A=new Ct({uniforms:{prevPos:{value:E},velTex:{value:h},dt:{value:1/60},texSize:{value:r}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }",fragmentShader:b,depthTest:!1,depthWrite:!1});this.gpuVelMaterial=T,this.gpuPosMaterial=A,this.gpuVelQuad=new wt(new Di(2,2),this.gpuVelMaterial),this.gpuPosQuad=new wt(new Di(2,2),this.gpuPosMaterial),this.gpuVelQuad.visible=!1,this.gpuPosQuad.visible=!1,this.gpuQuadScene.add(this.gpuVelQuad),this.gpuQuadScene.add(this.gpuPosQuad);const w={minFilter:dn,magFilter:dn,type:Gt,format:bt};this.gpuVelRTA=new kt(r,r,w),this.gpuVelRTB=new kt(r,r,w),this.gpuPosRTA=new kt(r,r,w),this.gpuPosRTB=new kt(r,r,w),this.gpuVelMaterial.uniforms.prevVel.value=h,this.gpuVelMaterial.uniforms.prevPos.value=E,n.setRenderTarget(this.gpuVelRTA),n.render(this.gpuQuadScene,this.gpuQuadCamera),n.setRenderTarget(null),this.gpuPosMaterial.uniforms.prevPos.value=E,this.gpuPosMaterial.uniforms.velTex.value=h,n.setRenderTarget(this.gpuPosRTA),n.render(this.gpuQuadScene,this.gpuQuadCamera),n.setRenderTarget(null),this.gpuSwap=!1,this.gpuEnabled=!0,this.applyPendingUniforms()}catch(r){const s=this.detectRenderer();console.error(`[GPU Particles] Failed to initialize GPU particle system. renderer=${s.renderer}, vendor=${s.vendor}`,r),this.gpuEnabled=!1,this.switchToFallback()}}updateGPU(n,e){if(!(!this.gpuEnabled||!this.gpuRenderer||!this.gpuQuadScene||!this.gpuQuadCamera)&&this.particleInstancedMesh){if(this.gpuUpdateInterval>0){if(this.gpuUpdateAccumulator+=n,this.gpuUpdateAccumulator<this.gpuUpdateInterval)return;this.gpuUpdateAccumulator=0}this.applyPendingUniforms();try{const i=this.gpuPosRTA.width,r=this.gpuSwap?this.gpuPosRTB:this.gpuPosRTA,s=this.gpuSwap?this.gpuVelRTB:this.gpuVelRTA,a=this.gpuSwap?this.gpuVelRTA:this.gpuVelRTB,o=this.gpuSwap?this.gpuPosRTA:this.gpuPosRTB;try{const c=this.gpuVelMaterial;this.updateScalarUniform(c.uniforms.time,performance.now()/1e3,.005),this.updateScalarUniform(c.uniforms.dt,n,1e-4),this.updateScalarUniform(c.uniforms.texSize,i,0),c.uniforms.prevVel.value=s.texture,c.uniforms.prevPos.value=r.texture;const f=e.segmentIntensityBoost;this.updateScalarUniform(c.uniforms.subBass,(e.audioFeatures.subBass||0)*f),this.updateScalarUniform(c.uniforms.bass,(e.audioFeatures.bass||0)*f),this.updateScalarUniform(c.uniforms.lowMid,(e.audioFeatures.lowMid||0)*f),this.updateScalarUniform(c.uniforms.mid,(e.audioFeatures.mid||0)*f),this.updateScalarUniform(c.uniforms.highMid,(e.audioFeatures.highMid||0)*f),this.updateScalarUniform(c.uniforms.treble,(e.audioFeatures.treble||0)*f),this.updateScalarUniform(c.uniforms.sparkle,(e.audioFeatures.sparkle||0)*f),this.updateScalarUniform(c.uniforms.audioForce,e.gpuAudioForce||0),this.updateScalarUniform(c.uniforms.curlStrength,e.curlStrength,.001),this.updateScalarUniform(c.uniforms.noiseScale,e.noiseScale,.001),this.updateScalarUniform(c.uniforms.noiseSpeed,e.noiseSpeed,.001),this.updateScalarUniform(c.uniforms.neuralGain,this.synestheticUniforms.neuralGain,.001),this.updateScalarUniform(c.uniforms.resonanceFloor,this.synestheticUniforms.resonanceFloor,.001),this.updateScalarUniform(c.uniforms.consciousnessPersistence,this.synestheticUniforms.persistence,.001);const m=(e.audioFeatures.bass||0)*.6+(e.audioFeatures.mid||0)*.4+(e.audioFeatures.sparkle||0)*.3,p=Math.min(2.6,this.consciousnessIntensity*(.7+e.segmentIntensityBoost*.45)+m*.6);this.updateScalarUniform(c.uniforms.consciousnessDrive,p,.001),this.syncInstancedConsciousUniform(p)}catch{}this.gpuVelQuad.visible=!0,this.gpuRenderer.setRenderTarget(a),this.gpuRenderer.render(this.gpuQuadScene,this.gpuQuadCamera),this.gpuVelQuad.visible=!1;try{const c=this.gpuPosMaterial;this.updateScalarUniform(c.uniforms.dt,n,1e-4),c.uniforms.prevPos.value=r.texture,c.uniforms.velTex.value=a.texture}catch{}this.gpuPosQuad.visible=!0,this.gpuRenderer.setRenderTarget(o),this.gpuRenderer.render(this.gpuQuadScene,this.gpuQuadCamera),this.gpuPosQuad.visible=!1,this.gpuRenderer.setRenderTarget(null);try{const c=this.particleInstancedMesh.material;c.uniforms.posTex.value=o.texture,this.updateScalarUniform(c.uniforms.texSize,i,0),c.needsUpdate=!0}catch{}this.gpuSwap=!this.gpuSwap}catch{this.gpuEnabled=!1,this.switchToFallback()}}}buildParticleMeshes(){const n=at.PARTICLE_COUNT;try{const a=new ka(1,6,4),o=new Fa({color:16777215});this.particleInstancedMesh=new Bc(a,o,n),this.particleInstancedMesh.instanceMatrix.setUsage($n),this.particleInstancedMesh.frustumCulled=!1,this.particleInstancedMesh.renderOrder=10;const c=this._dummy;for(let l=0;l<n;l++)c.position.set(0,0,0),c.scale.setScalar(0),c.updateMatrix(),this.particleInstancedMesh.setMatrixAt(l,c.matrix);try{const l=new Float32Array(n*3),d=new Float32Array(n),S=new Float32Array(n*3),E=new Float32Array(n),h=new kn(l,3),u=new kn(d,1),M=new kn(S,3),T=new kn(E,1);this.particleInstancedMesh.geometry.setAttribute("instanceColor",h),this.particleInstancedMesh.geometry.setAttribute("instanceSpeed",u),this.particleInstancedMesh.geometry.setAttribute("instancePosition",M),this.particleInstancedMesh.geometry.setAttribute("instanceScale",T)}catch{}try{const l=new Float32Array(n),d=new kn(l,1);this.particleInstancedMesh.geometry.setAttribute("instanceFeature",d)}catch{}const f=`
          attribute vec3 instancePosition;
          attribute float instanceScale;
          attribute vec3 instanceColor;
          attribute float instanceSpeed;
          attribute float instanceFeature;
          uniform sampler2D posTex;
          uniform float texSize;
          uniform float consciousnessIntensity;
          varying vec3 vColor;
          varying float vFeature;
          varying float vConscious;
          varying vec3 vNormal;

          vec3 sampleTexturePosition(float id, float dimension) {
            float row = floor(id / dimension);
            float col = mod(id, dimension);
            vec2 uv = (vec2(col, row) + 0.5) / dimension;
            return texture2D(posTex, uv).rgb;
          }

          void main() {
            float fi = instanceFeature;
            vFeature = fi;
            vConscious = consciousnessIntensity;
            float tint = 0.15 * (fi - 3.0);
            float neuralMix = clamp(consciousnessIntensity * 0.35, 0.0, 0.9);
            vec3 neuralAura = mix(instanceColor, vec3(0.78, 0.55, 1.0), neuralMix);
            vColor = neuralAura + vec3(tint, -tint * 0.2, tint * 0.1);

            float id = float(gl_InstanceID);
            vec3 center = instancePosition;
            if (texSize > 0.5) {
              center = sampleTexturePosition(id, texSize);
            }

            float sc = max(0.0001, instanceScale);
            vec3 localScaled = position * sc;
            vec4 mvPosition = modelViewMatrix * vec4(localScaled + center, 1.0);
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,m=`
          varying vec3 vColor;
          varying float vFeature;
          varying float vConscious;
          varying vec3 vNormal;
          void main() {
            vec3 n = normalize(vNormal);
            float rim = pow(1.0 - max(0.0, dot(n, vec3(0.0, 0.0, 1.0))), 2.0);
            float brightness = 0.75 + rim * 0.8;
            float neuralGlow = 0.65 + clamp(vConscious, 0.0, 2.5) * 0.35;
            vec3 color = vColor * brightness * neuralGlow;
            float desat = 1.0 - clamp((vFeature - 2.0) * 0.06, 0.0, 0.35);
            color = mix(vec3(dot(color, vec3(0.333))), color, desat);
            color = mix(color, vec3(0.82, 0.45, 1.0), clamp(vConscious * 0.25, 0.0, 0.5));
            gl_FragColor = vec4(color, 1.0);
          }
        `,p=new Ct({uniforms:{posTex:{value:null},texSize:{value:0},consciousnessIntensity:{value:this.consciousnessIntensity}},vertexShader:f,fragmentShader:m,transparent:!0,depthWrite:!1,depthTest:!1,blending:rn});this.particleInstancedMesh.material=p,this.particleInstancedMesh.matrixAutoUpdate=!1,this.particleInstancedMesh.matrix.identity(),this.particleInstancedMesh.count=this.particleBudget,this.scene.add(this.particleInstancedMesh),this.validateParticleLayout()}catch{}const e=new Float32Array(n*3),i=new Float32Array(n*3),r=new Float32Array(n),s=new gn;if(s.setAttribute("position",new _t(e,3)),s.setAttribute("velocity",new _t(i,3)),s.setAttribute("startTime",new _t(r,1)),s.attributes.position.updateRange={offset:0,count:0},s.attributes.velocity.updateRange={offset:0,count:0},s.attributes.startTime.updateRange={offset:0,count:0},this.particleSystem=new Ga(s,new kc({size:at.PARTICLE_BASE_SIZE,color:16777215,transparent:!0,depthWrite:!1,depthTest:!1,blending:rn,sizeAttenuation:!0})),this.particleInstancedMesh||this.scene.add(this.particleSystem),this.particleInstancedMesh){this.instanceStartTimes=new Float32Array(n),this.instanceLifetimes=new Float32Array(n);for(let a=n-1;a>=0;a--)this.instanceFreeStack.push(a),this.instanceStartTimes[a]=0,this.instanceLifetimes[a]=0}}spawnInstanceBatch(n,e,i){if(!this.particleInstancedMesh||this.particleBudget<=0)return;const s=this._maxFrameSpawns-this._frameSpawnCount,a=Math.min(n,s);if(a<=0)return;const o=this.particleSystem.geometry.attributes.position,c=this.particleSystem.geometry.attributes.velocity,f=this.particleSystem.geometry.attributes.startTime,m=this._dummy,p=[];for(let l=0;l<a;l++){const d=this.allocateInstance();if(d===-1)break;p.push(d);const S=e.feature?this.featureVisuals.get(e.feature):void 0,E=Math.min(1,(e.feature&&e.audioFeatures[e.feature]||0)*e.segmentIntensityBoost),h=1.5+E*2,u=e.origin.x+(Math.random()-.5)*h,M=e.origin.y+(Math.random()-.5)*h,T=e.origin.z+(Math.random()-.5)*h;m.position.set(u,M,T);const x=at.PARTICLE_BASE_SIZE*((S==null?void 0:S.size)??1)*(.7+Math.random()*.6);if(m.scale.setScalar(x*(1+E*1.2)),m.updateMatrix(),this.particleInstancedMesh.setMatrixAt(d,m.matrix),this.instanceStartTimes&&this.instanceLifetimes){this.instanceStartTimes[d]=i;const A=(S==null?void 0:S.lifetime)??1.5;this.instanceLifetimes[d]=A+(Math.random()-.2)*A*.5}const b=d*3;o.array[b+0]=u,o.array[b+1]=M,o.array[b+2]=T,c.array[b+0]=0,c.array[b+1]=0,c.array[b+2]=0,f.array[d]=i;try{const A=this.particleInstancedMesh.geometry,w=A.getAttribute("instanceColor"),R=A.getAttribute("instanceSpeed"),_=A.getAttribute("instanceFeature"),g=A.getAttribute("instancePosition"),P=A.getAttribute("instanceScale");if(w){const U=d*3;let I=[.7,.7,.7];if(S){const X=.6+.4*Math.min(1,(e.feature&&e.audioFeatures[e.feature]||0)*e.segmentIntensityBoost);I=[S.color[0]*X,S.color[1]*X,S.color[2]*X]}else I=[.6+Math.random()*.4,.6+Math.random()*.4,.6+Math.random()*.4];w.array[U+0]=I[0],w.array[U+1]=I[1],w.array[U+2]=I[2],w.needsUpdate=!0}if(R&&(R.array[d]=.5+Math.random()*2,R.needsUpdate=!0),g&&(g.array[b+0]=u,g.array[b+1]=M,g.array[b+2]=T,g.needsUpdate=!0),P&&(P.array[d]=x,P.needsUpdate=!0),_){const U=e.feature==="subBass"?0:e.feature==="bass"?1:e.feature==="lowMid"?2:e.feature==="mid"?3:e.feature==="highMid"?4:e.feature==="treble"?5:e.feature==="sparkle"?6:1;_.array[d]=U,_.needsUpdate=!0}}catch{}}if(p.length!==0&&(this._frameSpawnCount+=p.length,o.needsUpdate=!0,c.needsUpdate=!0,f.needsUpdate=!0,this.particleInstancedMesh.instanceMatrix.needsUpdate=!0,p.length>0)){const l=Math.min(...p),d=l*3;o.updateRange={offset:d,count:p.length*3},c.updateRange={offset:d,count:p.length*3},f.updateRange={offset:l,count:p.length}}}spawnPointsBatch(n,e,i,r,s,a){if(!this.particleSystem)return;const o=this._maxFrameSpawns-this._frameSpawnCount,c=Math.min(n,o);if(c<=0)return;const f=this.particleSystem.geometry,m=f.attributes.position,p=f.attributes.velocity,l=f.attributes.startTime,d=this.particleBudget;if(d<=0||this.particleCursor+c>d&&(this.particleCursor=0,this.particleCursor+c>d))return;const S=this.particleCursor*3;for(let E=0;E<c;E++){const h=this.particleCursor+E,u=h*3,T=1.5+Math.min(1,(i&&r[i]||0)*s)*2;m.array[u+0]=e.x+(Math.random()-.5)*T,m.array[u+1]=e.y+(Math.random()-.5)*T,m.array[u+2]=e.z+(Math.random()-.5)*T,p.array[u+0]=0,p.array[u+1]=0,p.array[u+2]=0,l.array[h]=a}m.updateRange={offset:S,count:c*3},p.updateRange={offset:S,count:c*3},l.updateRange={offset:this.particleCursor,count:c},m.needsUpdate=!0,p.needsUpdate=!0,l.needsUpdate=!0,this.particleCursor+=c,this._frameSpawnCount+=c}allocateInstance(){if(!this.instanceFreeStack||this.instanceFreeStack.length===0)return-1;for(;this.instanceFreeStack.length>0;){const n=this.instanceFreeStack.pop();if(n<this.particleBudget)return n}return-1}registerConsciousParticle(n,e,i,r,s){var m;if(!this.synestheticSettings)return;const a=n||"sparkle",o=Math.max(0,Math.min(1,i*r)),c=((m=this.synestheticSettings)==null?void 0:m.lifespanSeconds)??4,f={id:this.consciousIdCounter++,featureKey:a,position:e.clone(),velocity:new z((Math.random()-.5)*.35,.05+Math.random()*.12,(Math.random()-.5)*.35),resonance:o,createdAt:s,lifespan:Math.max(.5,c*(.75+Math.random()*.5))};this.consciousParticles.push(f),this.consciousParticles.length>256&&this.consciousParticles.splice(0,this.consciousParticles.length-256)}freeInstance(n){this.instanceFreeStack||(this.instanceFreeStack=[]),this.instanceLifetimes&&(this.instanceLifetimes[n]=0),this.instanceStartTimes&&(this.instanceStartTimes[n]=0),n<this.particleBudget&&this.instanceFreeStack.push(n);try{if(this.particleInstancedMesh){const e=this.particleInstancedMesh.geometry,i=e.getAttribute("instancePosition"),r=e.getAttribute("instanceScale");if(i){const s=n*3;i.array[s+0]=0,i.array[s+1]=-9999,i.array[s+2]=0,i.needsUpdate=!0}r&&(r.array[n]=0,r.needsUpdate=!0)}}catch{}}}class Vh{constructor(n=0){N(this,"pool",[]);for(let e=0;e<n;e++)this.pool.push(new z)}acquire(){return this.pool.pop()||new z}release(n){n.set(0,0,0),this.pool.push(n)}withVector(n){const e=this.acquire();try{n(e)}finally{this.release(e)}}}class Hh{constructor(n,e,i){N(this,"scene");N(this,"sky");N(this,"fog");N(this,"baseSkyTint");N(this,"workingColor",new Pe);N(this,"targetSkyColor",new Pe);N(this,"tintOverride");N(this,"synesthetic",null);this.scene=n,this.sky=n.getObjectByName("sky")||null,this.fog=n.fog instanceof Va?n.fog:null,this.baseSkyTint=new Pe(e),this.tintOverride=i!=null&&i.tint?new Pe(i.tint):null,this.synesthetic=i}setSynesthetic(n){this.synesthetic=n}update(n){var d,S;const{deltaSeconds:e,frame:i,audioFeatures:r,segmentColor:s,segmentIntensity:a}=n,o=((d=this.synesthetic)==null?void 0:d.turbulenceBias)??1,c=((S=this.synesthetic)==null?void 0:S.passionIntensity)??1,f=r.bass??0,m=(i==null?void 0:i.energy)??r.subBass??0,p=Math.max(r.mid??0,r.highMid??0);return this.updateSkyUniforms({deltaSeconds:e,bass:f,energy:m,segmentColor:s,segmentIntensity:a,turbulenceBias:o}),this.updateFog({deltaSeconds:e,bass:f,energy:m}),Math.min(2,.7+c*(.5+p*.9))}updateSkyUniforms(n){var S,E,h,u;if(!this.sky)return;const e=this.sky.material;if(!e||!e.uniforms)return;const i=e.uniforms,{deltaSeconds:r,bass:s,energy:a,segmentColor:o,segmentIntensity:c,turbulenceBias:f}=n,m=(10+s*16)*f,p=2+s*2.5,l=Ee.clamp(r*1.5,.02,.16);typeof((S=i.turbidity)==null?void 0:S.value)=="number"&&(i.turbidity.value=Ee.lerp(i.turbidity.value,m,l)),typeof((E=i.rayleigh)==null?void 0:E.value)=="number"&&(i.rayleigh.value=Ee.lerp(i.rayleigh.value,p,l));const d=this.tintOverride??this.baseSkyTint;this.targetSkyColor.copy(d).lerp(o,Ee.clamp(.35+a*.4+c*.15,0,1)),((h=i.mieColor)==null?void 0:h.value)instanceof Pe&&i.mieColor.value.lerp(this.targetSkyColor,l*.8),((u=i.upColor)==null?void 0:u.value)instanceof Pe&&i.upColor.value.lerp(this.targetSkyColor,l*.8)}updateFog(n){if(!this.fog)return;const{deltaSeconds:e,bass:i,energy:r}=n,s=.0025+r*.005;this.fog.density=Ee.lerp(this.fog.density,s,Ee.clamp(e*1.8,.04,.2));const a=this.workingColor.copy(this.baseSkyTint).lerp(this.tintOverride??this.baseSkyTint,.4+i*.3);this.fog.color.lerp(a,Ee.clamp(e*1.2,.04,.18))}}class zh{constructor(){N(this,"pool",[]);N(this,"activeGeometries",new Set)}acquire(){const n=this.pool.pop()||new gn;return this.activeGeometries.add(n),n}release(n){if(this.activeGeometries.has(n))try{if(typeof n.clear=="function")n.clear();else{const e=n;if(e.attributes&&typeof e.attributes=="object")for(const i of Object.keys(e.attributes))if(typeof n.deleteAttribute=="function")n.deleteAttribute(i);else try{delete e.attributes[i]}catch{}try{n.setIndex(null)}catch{}if(e.morphAttributes&&typeof e.morphAttributes=="object")for(const i of Object.keys(e.morphAttributes))try{delete e.morphAttributes[i]}catch{}try{e.boundsTree&&delete e.boundsTree}catch{}try{n.boundingBox=null,n.boundingSphere=null}catch{}try{n.groups=[]}catch{}}this.activeGeometries.delete(n),this.pool.push(n)}catch{try{n.dispose()}catch{}this.activeGeometries.delete(n),this.pool.push(new gn)}}dispose(){this.pool.forEach(n=>n.dispose()),this.activeGeometries.forEach(n=>n.dispose()),this.pool=[],this.activeGeometries.clear()}}const jt=new zh,Wh=t=>Math.max(0,Math.min(1,t)),qn=.3,ma=1.8,Xh=.12,ga=2,_a=1,qh=2e3,Yh=50,Kh=3e3,Ja=.35,va=.7,$h=!0,Qh=Ja+.2,Zh=.28,jh=.92,Jh=6,em=48,en=class en{constructor(n,e,i){N(this,"scene");N(this,"camera");N(this,"trackData");N(this,"trackMesh");N(this,"trackMaterial");N(this,"pathCurve",null);N(this,"ghostRibbonMesh",null);N(this,"ghostRibbonMaterial",null);N(this,"particles");N(this,"targetGlowIntensity",qn);N(this,"gpuAudioForce",0);N(this,"rawAudioForce",0);N(this,"curlStrength",.12);N(this,"noiseScale",2);N(this,"noiseSpeed",.12);N(this,"audioFeatures",{subBass:0,bass:0,lowMid:0,mid:0,highMid:0,treble:0,sparkle:0});N(this,"segmentProgress",[]);N(this,"timelineEvents",[]);N(this,"timelineTriggeredUntil",new Map);N(this,"lastAudioTimeSeconds",0);N(this,"baseRailColor");N(this,"baseEmissiveColor");N(this,"placeTrackUnderCamera",$h);N(this,"trackUnderCameraVerticalOffset",Qh);N(this,"trackInsideOpacity",Zh);N(this,"trackDefaultOpacity",jh);N(this,"trackOpacityLerpSpeed",Jh);N(this,"trackRadius",Ja);N(this,"_forceInside",!1);N(this,"_tmpClosest",new z);N(this,"baseGhostTintA");N(this,"baseGhostTintB");N(this,"trackTintA");N(this,"trackTintB");N(this,"trackShaderUniforms",null);N(this,"segmentColorTarget");N(this,"segmentIntensityBoost",1);N(this,"currentSegmentIndex",0);N(this,"_colorTmp",new Pe);N(this,"_colorTmp2",new Pe);N(this,"_colorTmp3",new Pe);N(this,"_forward",new z);N(this,"_right",new z);N(this,"_up",new z);N(this,"highQualityMode",!0);N(this,"lastPerformanceCheck",0);N(this,"frameCount",0);N(this,"lowQualitySince",null);N(this,"isWarmedUp",!1);N(this,"firstUpdateTime",0);N(this,"lastUpdateSeconds",0);N(this,"trackPulse",0);N(this,"synesthetic",null);N(this,"atmosphere",null);N(this,"passionGain",1);N(this,"motionParticlePool",[]);N(this,"speedStreakGeometry",null);N(this,"speedStreakMaterial",null);N(this,"speedStreakMesh",null);N(this,"speedStreakAges",null);N(this,"speedStreakLifetimes",null);N(this,"speedStreakVelocities",null);N(this,"speedStreakCursor",0);N(this,"speedStreakBufferSize",0);N(this,"tunnelRushMaterial",null);N(this,"tunnelRushMesh",null);N(this,"lastMotionPosition",new z);N(this,"hasMotionHistory",!1);N(this,"_animationFrameHandles",[]);N(this,"previousTrackModelViewMatrix",new ft);N(this,"rideSpeedSmoothed",0);N(this,"hasPreviousModelViewMatrix",!1);N(this,"motionEffectsInitialized",!1);N(this,"motionUniformsBound",!1);N(this,"_tmpMatrix",new ft);N(this,"trackPathPoints",[]);N(this,"usingProceduralTrack",!1);N(this,"_vectorPool",new Vh(12));N(this,"_scopedVectors",[]);N(this,"_colorPool",Array.from({length:4},()=>new Pe));N(this,"_colorPoolIndex",0);var m,p,l;this.scene=n,this.camera=i,this.trackData=e,this.synesthetic=e.synesthetic??null;const r=this.analyzeAndSanitizePath(e.path);console.log("[VisualEffects] Track diagnostics",{hasPath:Array.isArray(e.path),receivedCount:Array.isArray(e.path)?e.path.length:0,validCount:r.points.length,issues:r.issues,sample:r.points.slice(0,3).map(d=>({x:d.x,y:d.y,z:d.z}))}),r.issues.length&&console.warn("[VisualEffects] Track path issues detected",r.issues),this.trackPathPoints=r.points,this.trackPathPoints.length<2?(console.warn("[VisualEffects] Track path invalid or too short, generating procedural fallback"),this.trackPathPoints=this.generateProceduralTrack(e),this.usingProceduralTrack=!0):this.usingProceduralTrack=!1;const s=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);this.highQualityMode=!s,this.baseRailColor=new Pe(e.railColor||"#ffffff"),this.baseEmissiveColor=new Pe(e.glowColor||"#00ffff");const a=new Pe("#e6f3ff"),o=new Pe("#ffe5ff");this.baseRailColor.lerp(a,.35),this.baseEmissiveColor.lerp(o,.4),this.segmentColorTarget=this.baseEmissiveColor.clone(),this.baseGhostTintA=new Pe("#cfe9ff"),this.baseGhostTintB=new Pe("#ffdff9"),this.trackTintA=this.baseRailColor.clone().lerp(this.baseGhostTintA,.5),this.trackTintB=this.baseEmissiveColor.clone().lerp(this.baseGhostTintB,.6);const c=((m=e.segmentDetails)==null?void 0:m.length)??0;this.segmentProgress=this.ensureSegmentMidpoints(e.segmentProgress,e.segmentDetails,c);try{this.timelineEvents=Array.isArray(e.events)?e.events.slice():[],this.atmosphere=new Hh(this.scene,e.skyColor1||"#0d0a1f",((p=this.synesthetic)==null?void 0:p.atmosphere)??null);for(const d of this.timelineEvents)d&&d.timestamp===void 0&&d.params&&d.params.audioSyncPoint&&(d.timestamp=d.params.audioSyncPoint);this.timelineEvents.sort((d,S)=>(d.timestamp||0)-(S.timestamp||0))}catch{this.timelineEvents=[]}this.trackMaterial=new Gc({color:this.baseRailColor.clone(),emissive:this.baseEmissiveColor.clone(),emissiveIntensity:qn,metalness:.15,roughness:.65,transparent:!0,opacity:this.trackDefaultOpacity,side:Lt}),this.trackMaterial.onBeforeCompile=d=>{d.uniforms.trackTime={value:0},d.uniforms.pulseIntensity={value:0},d.uniforms.segmentBoost={value:1},d.uniforms.audioFlow={value:0},d.uniforms.ghostTintA={value:this.trackTintA},d.uniforms.ghostTintB={value:this.trackTintB},d.uniforms.distortionStrength={value:0},d.uniforms.bassIntensity={value:0},d.uniforms.trebleIntensity={value:0},d.uniforms.rideSpeed={value:0},d.uniforms.motionBlur={value:0},d.uniforms.cameraDirection={value:new z},d.uniforms.previousModelViewMatrix={value:new ft},d.fragmentShader=d.fragmentShader.replace("#include <common>",`#include <common>
varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vVelocity;
varying float vSpeedLines;
uniform float trackTime;
uniform float pulseIntensity;
uniform float segmentBoost;
uniform float audioFlow;
uniform vec3 ghostTintA;
uniform vec3 ghostTintB;
uniform float rideSpeed;
uniform float motionBlur;
uniform vec3 cameraDirection;
`).replace("vec3 totalEmissiveRadiance = emissive;",`float pathV = clamp(vUv.y, 0.0, 1.0);
float railCenterLine = abs(vUv.x - 0.5) * 2.0;
float railShine = smoothstep(0.35, 0.85, 1.0 - railCenterLine);
float loopWave = sin(pathV * 24.0 - trackTime * 5.5);
float traveler = smoothstep(0.05, 0.95, fract(pathV - trackTime * 0.35));
float spirit = pulseIntensity + audioFlow * 0.35 + segmentBoost * 0.2;
float speedTrailBase = rideSpeed * smoothstep(0.1, 0.9, railShine);
vec3 energyColorBase = mix(ghostTintA, ghostTintB, clamp(pathV + sin(trackTime * 3.0) * 0.08, 0.0, 1.0));

// This calculation is now performed per-vertex and interpolated.
float speedLines = vSpeedLines;

float velocityMag = length(vVelocity);
vec3 velocityDir = velocityMag > 1e-6 ? vVelocity / velocityMag : vec3(0.0);
float camDirMag = length(cameraDirection);
vec3 camDir = camDirMag > 1e-6 ? cameraDirection / camDirMag : vec3(0.0, 0.0, -1.0);
float velocityDot = dot(velocityDir, camDir);
vec3 dopplerShift = velocityDot > 0.0 ? vec3(0.0, 0.0, 0.3) * velocityDot : vec3(0.3, 0.0, 0.0) * abs(velocityDot);

vec2 motionVector = vUv - vec2(0.5, pathV - trackTime * 0.1);
float motionTrail = exp(-length(motionVector * 10.0)) * motionBlur;

float energyFlow = sin(pathV * 20.0 - trackTime * 8.0) * 0.5 + 0.5;
energyFlow = pow(energyFlow, 3.0);
float flowIntensity = audioFlow + rideSpeed * 0.1;

float perspectiveBlur = smoothstep(0.0, 1.0, abs(vUv.x - 0.5) * 2.0);
perspectiveBlur *= rideSpeed * 0.2;

vec3 motionColor = mix(ghostTintA, ghostTintB, clamp(pathV + sin(trackTime * 4.0) * 0.1, 0.0, 1.0));
vec3 speedGlowDynamic = motionColor * (speedLines + energyFlow * flowIntensity);
vec3 trailGlow = motionColor * motionTrail * 0.8;
vec3 blurGlow = motionColor * perspectiveBlur;
vec3 dreamTint = energyColorBase * (0.35 + 0.25 * traveler + 0.2 * max(loopWave, 0.0));
vec3 speedGlowBase = energyColorBase * speedTrailBase * 0.5;

vec3 totalEmissiveRadiance = emissive + dreamTint * spirit + speedGlowBase + speedGlowDynamic + trailGlow + blurGlow + dopplerShift;
`),d.vertexShader=d.vertexShader.replace("#include <common>",`#include <common>
varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vVelocity;
varying float vSpeedLines;
uniform float trackTime;
uniform float distortionStrength;
uniform float bassIntensity;
uniform float trebleIntensity;
uniform float rideSpeed;
uniform mat4 previousModelViewMatrix;
`).replace("#include <begin_vertex>",`#include <begin_vertex>
vUv = uv;
vec4 currentPosition = modelViewMatrix * vec4(position, 1.0);
vec4 previousPosition = previousModelViewMatrix * vec4(position, 1.0);
vVelocity = (currentPosition - previousPosition).xyz;
float vPath = clamp(uv.y, 0.0, 1.0);
float speedWarp = sin(vPath * 30.0 - trackTime * rideSpeed) * rideSpeed * 0.05;
transformed += normal * speedWarp;
transformed += normal * bassIntensity * (1.5 + rideSpeed * 0.1);
float trebleWarp = sin(vPath * 60.0 - trackTime * 4.0) * trebleIntensity * (0.4 + rideSpeed * 0.02);
transformed += normal * trebleWarp;
float motionRibbon = sin(vPath * 18.0 + trackTime * (2.0 + rideSpeed * 0.5));
float ribbonIntensity = distortionStrength * (0.2 + 0.3 * motionRibbon);
transformed += normal * ribbonIntensity;
float speedVibration = sin(vPath * 100.0 + trackTime * 20.0) * rideSpeed * 0.02;
transformed += normal * speedVibration;
vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;

// Move speed lines calculation from fragment to vertex shader
float pathV_vs = clamp(uv.y, 0.0, 1.0);
float speedLines_vs = 0.0;
for (int i = 0; i < 5; i++) {
  float lineOffset = float(i) * 0.2;
  float speedLine = sin((pathV_vs + lineOffset) * 50.0 - trackTime * rideSpeed * 2.0);
  speedLines_vs += smoothstep(0.8, 1.0, speedLine) * (1.0 - lineOffset);
}
vSpeedLines = speedLines_vs * rideSpeed * 0.3;
`),this.trackShaderUniforms=d.uniforms,this.motionUniformsBound=!1,this.configureMotionUniforms(),this.initializeMotionEffects(),this.hasPreviousModelViewMatrix=!1},this.highQualityMode?this.trackPathPoints.length*ga:this.trackPathPoints.length*_a,this.trackPathPoints.map(d=>d.clone()),this.placeTrackUnderCamera&&this.computeOffsetCurvePoints(this.trackPathPoints),this.ghostRibbonMaterial=this.createGhostRibbonMaterial(),this.rebuildTrackGeometry(),this.particles=new Gh(this.scene);const f=this.highQualityMode?"high":"medium";this.particles.setQualityProfile(f),this.particles.setConsciousnessSettings(((l=this.synesthetic)==null?void 0:l.particles)??null),this.seedAmbientParticles(),this.initializeMotionEffects();try{const d=new Ba;this.camera.add(d);const S=new Is(this.baseEmissiveColor.clone(),0,48,2);S.name="audioGlow",d.add(S)}catch{}this.createTunnelRushEffect(),this.pathCurve&&(this.lastMotionPosition.copy(this.pathCurve.getPointAt(0)),this.hasMotionHistory=!0)}computeOffsetCurvePoints(n){var s;const e=(s=this.trackData)==null?void 0:s.upVectors,i=n.length;if(!e||e.length===0){const a=new z(0,-this.trackUnderCameraVerticalOffset,0);return n.map(o=>o.clone().add(a))}const r=[];for(let a=0;a<i;a++){let o=new z(0,1,0);if(e.length>=2){const f=a/Math.max(1,i-1)*(e.length-1),m=Math.floor(f),p=Math.min(m+1,e.length-1),l=f-m,d=new z(e[m].x,e[m].y,e[m].z),S=new z(e[p].x,e[p].y,e[p].z);o=d.lerp(S,l).normalize()}else e.length===1&&(o=new z(e[0].x,e[0].y,e[0].z).normalize());const c=o.clone().multiplyScalar(-this.trackUnderCameraVerticalOffset);r.push(n[a].clone().add(c))}return r}isCameraInsideTrack(n){var s;if(this._forceInside)return!0;try{if(this.trackMesh&&((s=this.trackMesh.geometry)!=null&&s.boundsTree)&&typeof this.trackMesh.geometry.boundsTree.closestPointToPoint=="function")return this.trackMesh.geometry.boundsTree.closestPointToPoint(n,this._tmpClosest),n.distanceTo(this._tmpClosest)<=this.trackRadius+.01}catch{}if(!this.pathCurve||!this.trackPathPoints||this.trackPathPoints.length===0)return!1;const e=Math.min(em,Math.max(12,Math.floor(this.trackPathPoints.length/4)));let i=Number.POSITIVE_INFINITY;for(let a=0;a<=e;a++){const o=a/e,f=this.pathCurve.getPointAt(o).distanceToSquared(n);f<i&&(i=f)}return Math.sqrt(i)<=this.trackRadius+.01}setTrackSettings(n){try{let e=!1;typeof n.placeUnderCamera=="boolean"&&n.placeUnderCamera!==this.placeTrackUnderCamera&&(this.placeTrackUnderCamera=n.placeUnderCamera,e=!0),typeof n.verticalOffset=="number"&&n.verticalOffset!==this.trackUnderCameraVerticalOffset&&(this.trackUnderCameraVerticalOffset=n.verticalOffset,e=!0),typeof n.trackRadius=="number"&&n.trackRadius!==this.trackRadius&&(this.trackRadius=n.trackRadius,e=!0),typeof n.defaultOpacity=="number"&&(this.trackDefaultOpacity=n.defaultOpacity,this.trackMaterial&&(this.trackMaterial.opacity=this.trackDefaultOpacity,this.trackMaterial.transparent=this.trackMaterial.opacity<.995,this.trackMaterial.needsUpdate=!0)),typeof n.insideOpacity=="number"&&(this.trackInsideOpacity=n.insideOpacity),typeof n.opacityLerpSpeed=="number"&&(this.trackOpacityLerpSpeed=n.opacityLerpSpeed),e&&this.rebuildTrackGeometry()}catch(e){console.error("[VisualEffects] Failed to apply track settings",e)}}forceTrackInside(n){this._forceInside=!!n;try{this.trackMaterial&&(this.trackMaterial.opacity=this._forceInside?this.trackInsideOpacity:this.trackDefaultOpacity,this.trackMaterial.transparent=this.trackMaterial.opacity<.995,this.trackMaterial.needsUpdate=!0)}catch{}}rebuildTrackGeometry(){try{if(!this.trackPathPoints||this.trackPathPoints.length===0)return;const n=this.highQualityMode?this.trackPathPoints.length*ga:this.trackPathPoints.length*_a;let e=this.trackPathPoints.map(a=>a.clone());this.placeTrackUnderCamera&&(e=this.computeOffsetCurvePoints(this.trackPathPoints));const i=new xr(e),r=new Ls(i,Math.max(4,n),this.trackRadius,this.highQualityMode?8:6,!1),s=jt.acquire();if(s.copy(r),r.dispose(),s.boundsTree=new Hr(s),!this.trackMesh)this.trackMesh=new wt(s,this.trackMaterial),this.trackMesh.frustumCulled=!0,this.scene.add(this.trackMesh);else{const a=this.trackMesh.geometry;jt.release(a),this.trackMesh.geometry=s}this.ghostRibbonMaterial||(this.ghostRibbonMaterial=this.createGhostRibbonMaterial()),this.rebuildGhostRibbon(i,Math.max(4,n))}catch(n){console.error("[VisualEffects] rebuildTrackGeometry failed",n)}}getTempVector3(){const n=this._vectorPool.acquire();return this._scopedVectors.push(n),n.set(0,0,0)}releaseTempVectors(){for(let n=this._scopedVectors.length-1;n>=0;n--){const e=this._scopedVectors[n];try{this._vectorPool.release(e)}catch(i){console.error("[VisualEffects] Error releasing temp vector. A pool vector may be lost.",i)}}this._scopedVectors.length=0}getTempColor(){const n=this._colorPool[this._colorPoolIndex];return this._colorPoolIndex=(this._colorPoolIndex+1)%this._colorPool.length,n.setHex(0)}acquireMotionVector(){return this.motionParticlePool.pop()??new z}releaseMotionVector(n){this.motionParticlePool.push(n)}updateUniformSafe(n,e,i=.001){return n&&n.value!==void 0&&Math.abs(n.value-e)>i?(n.value=e,!0):!1}updateColorUniformSafe(n,e,i=.001){if(!n||!n.value)return!1;const r=n.value;if(r instanceof Pe)return r.equals(e)?!1:(r.copy(e),!0);if(r instanceof z){const s=Math.abs(r.x-e.r),a=Math.abs(r.y-e.g),o=Math.abs(r.z-e.b);return s>i||a>i||o>i?(r.set(e.r,e.g,e.b),!0):!1}return n.value=e.clone(),!0}static normalizePathPoint(n){if(!n)return null;if(n instanceof z)return Number.isFinite(n.x)&&Number.isFinite(n.y)&&Number.isFinite(n.z)?n.clone():null;if(typeof n=="object"){const{x:e,y:i,z:r}=n;if(Number.isFinite(e)&&Number.isFinite(i)&&Number.isFinite(r))return new z(e,i,r)}return null}static removeDuplicatePoints(n,e=.01){if(n.length<=1)return n;const i=[n[0].clone()];for(let r=1;r<n.length;r++){const s=n[r],a=i[i.length-1];s.distanceTo(a)>e&&i.push(s.clone())}return i}analyzeAndSanitizePath(n){const e=[];if(!Array.isArray(n))return e.push("Path is not an array"),{points:[],issues:e};const i=[];n.forEach((s,a)=>{const o=en.normalizePathPoint(s);o?i.push(o):e.push(`Invalid point at index ${a}`)});const r=en.removeDuplicatePoints(i);return r.length===0?e.push("No valid points after sanitization"):r.length===1&&e.push("Only one unique point provided"),{points:r,issues:e}}static validateTrackData(n){const e=[];return n?(Array.isArray(n.path)?n.path.length<2&&e.push(`TrackData.path must contain at least 2 points (received ${n.path.length})`):e.push("TrackData.path must be an array"),Array.isArray(n.path)&&n.path.forEach((r,s)=>{en.normalizePathPoint(r)||e.push(`TrackData.path[${s}] is not a valid Vector3-like point`)}),{valid:e.length===0,issues:e}):(e.push("TrackData is null or undefined"),{valid:!1,issues:e})}generateProceduralTrack(n){const e=[],i=n.audioFeatures??{},r=typeof i.duration=="number"?i.duration:Ar(i.duration??120),s=typeof i.energy=="number"?Ee.clamp(i.energy,0,1):.5,a=typeof i.bpm=="number"?Math.max(60,Math.min(240,i.bpm)):120,o=Math.max(24,Math.round(32+r/30*12+s*24)),c=28+s*12,f=12+s*10;for(let m=0;m<=o;m++){const p=m/o,l=1+Math.sin(p*Math.PI*4)*.25*s,d=p*Math.PI*4*l+a/180*p,S=1+Math.sin(p*Math.PI*6)*.18,E=Math.cos(d)*c*S,h=Math.sin(d)*c*S,u=Math.sin(p*Math.PI*3)*f*s+Math.sin(p*Math.PI*9)*f*.25;e.push(new z(E,u,h))}return console.log("[VisualEffects] Procedural track generated",{pointCount:e.length,duration:r,energy:s,bpm:a}),e}seedAmbientParticles(){if(!this.pathCurve)return;const n=Math.min(48,Math.max(18,Math.floor(this.trackPathPoints.length/4))),e=performance.now()/1e3,i=va*4.2;this.particles.seedAmbientField(this.pathCurve,n,i,e,this.audioFeatures,.9)}async initGPU(n){await this.particles.initGPU(n,{curlStrength:this.curlStrength,noiseScale:this.noiseScale,noiseSpeed:this.noiseSpeed})}updateGPU(n){this.particles.updateGPU(n,{audioFeatures:this.audioFeatures,segmentIntensityBoost:this.segmentIntensityBoost,gpuAudioForce:this.gpuAudioForce,curlStrength:this.curlStrength,noiseScale:this.noiseScale,noiseSpeed:this.noiseSpeed})}setAudioFeatures(n){if(!(!n||typeof n!="object"))try{for(const e of Object.keys(n)){const i=n[e];typeof i=="number"&&(this.audioFeatures[e]=Math.max(0,Math.min(1,i)))}}catch(e){console.warn("[VisualEffects] setAudioFeatures received invalid data",e)}}makeEqualSpacedMidpoints(n){if(n<=0)return[];if(n===1)return[.5];const e=new Array(n);for(let i=0;i<n;i++)e[i]=(i+.5)/n;return e}buildMidpointsFromSegmentDetails(n){const e=(n==null?void 0:n.length)??0;if(e===0)return[];const i=n[0].start,r=n[e-1].end??n[e-1].start,s=Math.max(1e-6,r-i),a=new Array(e);for(let o=0;o<e;o++){const c=.5*((n[o].start??i)+(n[o].end??n[o].start??i));a[o]=Wh((c-i)/s)}return a}ensureSegmentMidpoints(n,e,i){return Array.isArray(n)&&n.length===i&&n.every(s=>Number.isFinite(s)&&s>=0&&s<=1)?n:e&&e.length===i?this.buildMidpointsFromSegmentDetails(e):this.makeEqualSpacedMidpoints(i)}configureMotionUniforms(){if(!this.trackShaderUniforms||this.motionUniformsBound)return;const n=this.trackShaderUniforms;if(!n.cameraDirection)n.cameraDirection={value:new z(0,0,-1)};else if(!(n.cameraDirection.value instanceof z)){const i=n.cameraDirection.value,r=new z;i&&typeof i=="object"?r.set(i.x??0,i.y??0,i.z??-1):r.set(0,0,-1),n.cameraDirection.value=r}n.previousModelViewMatrix?n.previousModelViewMatrix.value instanceof ft||(n.previousModelViewMatrix.value=this.previousTrackModelViewMatrix.clone()):n.previousModelViewMatrix={value:this.previousTrackModelViewMatrix.clone()},n.previousModelViewMatrix.value.copy(this.previousTrackModelViewMatrix),this.motionUniformsBound=!0}initializeMotionEffects(){if(this.motionEffectsInitialized||!this.particles){this.configureMotionUniforms();return}this.configureMotionUniforms(),this.particles.registerFeatureVisual("speed",{color:[.65,.9,1],sensitivity:.8,size:this.highQualityMode?1.4:1,lifetime:1.8,behavior:"trail"}),this.createSpeedStreakSystem(),this.motionEffectsInitialized=!0}getTargetSpeedStreakCount(){return this.highQualityMode?640:220}teardownSpeedStreakSystem(){if(this.speedStreakMesh){try{this.scene.remove(this.speedStreakMesh)}catch{}this.speedStreakMesh=null}if(this.speedStreakMaterial){try{this.speedStreakMaterial.dispose()}catch{}this.speedStreakMaterial=null}if(this.speedStreakGeometry){try{this.speedStreakGeometry.dispose()}catch{}this.speedStreakGeometry=null}this.speedStreakAges=null,this.speedStreakLifetimes=null,this.speedStreakVelocities=null,this.speedStreakCursor=0,this.speedStreakBufferSize=0}createSpeedStreakSystem(n){const e=Math.max(32,n??this.getTargetSpeedStreakCount());if(this.speedStreakGeometry&&this.speedStreakBufferSize===e)return;this.teardownSpeedStreakSystem();const i=new gn,r=new Float32Array(e*3),s=new Float32Array(e*3),a=new Float32Array(e),o=new Float32Array(e);o.fill(.6),i.setAttribute("position",new _t(r,3).setUsage($n)),i.setAttribute("velocity",new _t(s,3).setUsage($n)),i.setAttribute("age",new _t(a,1).setUsage($n)),i.setAttribute("lifetime",new _t(o,1).setUsage($n)),i.setDrawRange(0,e),i.computeBoundingSphere();const c=new Ct({transparent:!0,depthWrite:!1,depthTest:!0,blending:rn,uniforms:{time:{value:0},rideSpeed:{value:0},streakIntensity:{value:0},cameraDir:{value:new z(0,0,-1)},colorA:{value:this.trackTintA.clone()},colorB:{value:this.trackTintB.clone()}},vertexShader:`
attribute float age;
attribute float lifetime;
attribute vec3 velocity;
varying float vLife;
varying float vProgress;
uniform float rideSpeed;
uniform float streakIntensity;
uniform vec3 cameraDir;
void main() {
  float life = max(lifetime, 1e-4);
  float progress = clamp(age / life, 0.0, 1.0);
  vec3 forward = normalize(velocity + cameraDir * 0.35);
  float stretch = mix(0.55, 1.65, clamp(rideSpeed * 0.08, 0.0, 1.0));
  vec3 displaced = position - forward * progress * stretch;
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  float baseSize = mix(6.0, 18.0, clamp(rideSpeed * 0.1, 0.0, 1.0));
  baseSize *= streakIntensity;
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = baseSize * (1.0 - progress) * clamp(1.0 / max(-mvPosition.z, 0.1), 0.0, 2.0);
  vLife = 1.0 - progress;
  vProgress = progress;
}
      `,fragmentShader:`
varying float vLife;
varying float vProgress;
uniform float rideSpeed;
uniform float streakIntensity;
uniform vec3 colorA;
uniform vec3 colorB;
void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv * vec2(1.0, 2.6));
  float alpha = smoothstep(0.6, 0.0, dist);
  vec3 color = mix(colorA, colorB, clamp(vProgress + rideSpeed * 0.05, 0.0, 1.0));
  color += vec3(0.1, 0.02, 0.15) * rideSpeed * 0.08;
  alpha *= vLife * streakIntensity;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(color, alpha);
}
      `}),f=new Ga(i,c);f.frustumCulled=!1,f.renderOrder=2,this.scene.add(f),this.speedStreakGeometry=i,this.speedStreakMaterial=c,this.speedStreakMesh=f,this.speedStreakAges=a,this.speedStreakLifetimes=o,this.speedStreakVelocities=s,this.speedStreakCursor=0,this.speedStreakBufferSize=e}spawnMotionParticles(n,e,i){if(!this.speedStreakGeometry||!this.speedStreakAges||!this.speedStreakLifetimes||!this.speedStreakVelocities)return;const r=this.speedStreakAges.length;if(r===0||i<4.5)return;const s=this.highQualityMode?6:3,a=this.highQualityMode?.65:.35,o=Math.min(r,s+Math.floor(i*a)),c=this._right,f=this._up,m=this.speedStreakGeometry.getAttribute("position"),p=this.speedStreakGeometry.getAttribute("velocity"),l=this.speedStreakGeometry.getAttribute("age"),d=this.speedStreakGeometry.getAttribute("lifetime");for(let S=0;S<o;S++){const E=this.speedStreakCursor++%r,h=(Math.random()-.5)*4,u=(Math.random()-.5)*1.2,M=(Math.random()-.5)*1,T=n.x+e.x*h+c.x*u+f.x*M,x=n.y+e.y*h+c.y*u+f.y*M,b=n.z+e.z*h+c.z*u+f.z*M;m.setXYZ(E,T,x,b);const A=this.acquireMotionVector().copy(e).addScaledVector(c,(Math.random()-.5)*.6).addScaledVector(f,(Math.random()-.5)*.6).multiplyScalar(Math.max(4.5,i*1.6));p.setXYZ(E,A.x,A.y,A.z),this.releaseMotionVector(A);const w=Ee.lerp(.45,1.1,Math.random());this.speedStreakAges[E]=0,this.speedStreakLifetimes[E]=w,l.setX(E,0),d.setX(E,w)}m.needsUpdate=!0,p.needsUpdate=!0,l.needsUpdate=!0,d.needsUpdate=!0}updateMotionEffects(n,e,i,r){var o,c;if(n<=0)return this.rideSpeedSmoothed;this.trackShaderUniforms||this.configureMotionUniforms(),this._forward.subVectors(i,e),this._forward.lengthSq()<1e-6?this._forward.set(0,0,-1):this._forward.normalize(),this._right.copy(this._forward).cross(en.UP_VECTOR),this._right.lengthSq()<1e-6?this._right.set(1,0,0):this._right.normalize(),this._up.copy(this._right).cross(this._forward),this._up.lengthSq()<1e-6?this._up.set(0,1,0):this._up.normalize();let s=this.rideSpeedSmoothed;if(this.pathCurve){const f=this.getTempVector3();if(this.pathCurve.getPointAt(Ee.clamp(r,0,1),f),this.hasMotionHistory){const m=this.getTempVector3().subVectors(f,this.lastMotionPosition);s=Ee.clamp(m.length()/Math.max(n,1e-4),0,160)}else s=0,this.hasMotionHistory=!0;this.lastMotionPosition.copy(f)}if(this.rideSpeedSmoothed=Ee.lerp(this.rideSpeedSmoothed,s,.18),this.configureMotionUniforms(),((c=(o=this.trackShaderUniforms)==null?void 0:o.cameraDirection)==null?void 0:c.value)instanceof z&&this.trackShaderUniforms.cameraDirection.value.copy(this._forward),this.speedStreakGeometry||this.createSpeedStreakSystem(),this.speedStreakGeometry&&this.speedStreakAges&&this.speedStreakLifetimes&&this.speedStreakVelocities){const f=this.speedStreakGeometry.getAttribute("position");this.speedStreakGeometry.getAttribute("velocity");const m=this.speedStreakGeometry.getAttribute("age");this.speedStreakGeometry.getAttribute("lifetime");const p=this.speedStreakAges.length,l=this.speedStreakVelocities,d=n,S=f.array;for(let E=0;E<p;E++){const h=this.speedStreakLifetimes[E];if(h<=0)continue;const u=Math.min(h,this.speedStreakAges[E]+d);if(this.speedStreakAges[E]=u,m.setX(E,u),u<h){const M=E*3;S[M]+=l[M]*d,S[M+1]+=l[M+1]*d,S[M+2]+=l[M+2]*d}}f.needsUpdate=!0,m.needsUpdate=!0}const a=this.getTempVector3().copy(e).addScaledVector(this._forward,6);if(this.rideSpeedSmoothed>6&&this.spawnMotionParticles(a,this._forward,this.rideSpeedSmoothed),this.speedStreakMaterial){const f=this.speedStreakMaterial.uniforms;f.time.value+=n,f.rideSpeed.value=Ee.lerp(f.rideSpeed.value,this.rideSpeedSmoothed,.12),f.streakIntensity.value=Ee.lerp(f.streakIntensity.value,Math.min(1,this.rideSpeedSmoothed*.12),.18),f.colorA.value.copy(this.trackTintA),f.colorB.value.copy(this.trackTintB),f.cameraDir.value.copy(this._forward)}if(this.tunnelRushMaterial){const f=this.tunnelRushMaterial.uniforms;f.time.value+=n,f.speedFactor.value=Ee.lerp(f.speedFactor.value,Math.min(1.2,this.rideSpeedSmoothed*.08),.12),f.intensity.value=Ee.lerp(f.intensity.value,Math.min(1,this.gpuAudioForce*.12+this.rideSpeedSmoothed*.04),.08),f.colorA.value.copy(this.trackTintA),f.colorB.value.copy(this.trackTintB)}return this.updateTrackMotionMatrices(),this.rideSpeedSmoothed}createTunnelRushEffect(){if(this.tunnelRushMesh)return;const n=new ka(65,32,24),e=new Ct({side:xt,transparent:!0,depthWrite:!1,blending:rn,uniforms:{time:{value:0},intensity:{value:0},speedFactor:{value:0},colorA:{value:this.trackTintA.clone()},colorB:{value:this.trackTintB.clone()}},vertexShader:`
varying vec3 vNormalDir;
void main() {
  vNormalDir = normalize(normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
      `,fragmentShader:`
varying vec3 vNormalDir;
uniform float time;
uniform float intensity;
uniform float speedFactor;
uniform vec3 colorA;
uniform vec3 colorB;
void main() {
  float lane = sin(vNormalDir.z * 16.0 - time * (4.0 + speedFactor * 6.0));
  float radial = sin(vNormalDir.x * 12.0 + time * 5.0) * 0.5 + 0.5;
  float pulse = sin(time * 3.0 + vNormalDir.y * 8.0) * 0.5 + 0.5;
  float mixFactor = clamp(radial + speedFactor * 0.3, 0.0, 1.0);
  vec3 color = mix(colorA, colorB, mixFactor);
  color += vec3(0.2, 0.15, 0.3) * speedFactor;
  float opacity = clamp(intensity * (0.35 + pulse * 0.4) + abs(lane) * 0.25, 0.0, 1.0);
  if (opacity < 0.02) discard;
  gl_FragColor = vec4(color, opacity);
}
      `}),i=new wt(n,e);i.name="tunnelRush",i.renderOrder=1,this.camera.add(i),this.tunnelRushMesh=i,this.tunnelRushMaterial=e}updateTrackMotionMatrices(){if(!this.trackShaderUniforms||!this.trackMesh)return;this.camera.updateMatrixWorld();const n=this._tmpMatrix.multiplyMatrices(this.camera.matrixWorldInverse,this.trackMesh.matrixWorld);this.hasPreviousModelViewMatrix||(this.previousTrackModelViewMatrix.copy(n),this.hasPreviousModelViewMatrix=!0);const e=this.trackShaderUniforms.previousModelViewMatrix;e&&e.value instanceof ft&&e.value.copy(this.previousTrackModelViewMatrix),this.previousTrackModelViewMatrix.copy(n)}deriveSegmentColor(n){var r;if(!n)return this.baseEmissiveColor;const e=n.environmentChange;if(typeof e=="string"&&e.trim().length>0&&e.trim().toLowerCase()!=="none")try{const s=this.getTempColor().set(e);return this._colorTmp.copy(s),this._colorTmp}catch{}const i=((r=n.lightingEffect)==null?void 0:r.toLowerCase())||"";return i.includes("warm")||i.includes("ember")||i.includes("sun")||i.includes("fire")?this.getTempColor().set("#ff8a3d"):i.includes("cool")||i.includes("ice")||i.includes("aqua")||i.includes("ocean")?this.getTempColor().set("#4bb3ff"):i.includes("storm")||i.includes("night")||i.includes("void")||i.includes("nebula")?this.getTempColor().set("#6a5bff"):i.includes("forest")||i.includes("nature")||i.includes("lush")||i.includes("earth")?this.getTempColor().set("#4caf50"):this.baseEmissiveColor}applySegmentMood(n){if(!this.trackData.segmentDetails.length)return this.segmentIntensityBoost=1,this.segmentColorTarget.copy(this.baseEmissiveColor),this.segmentIntensityBoost;const e=Ee.clamp(n,0,1);let i=this.segmentProgress.findIndex(o=>e<=o+1e-6);i===-1&&(i=this.segmentProgress.length-1),i=Math.min(i,this.trackData.segmentDetails.length-1),this.currentSegmentIndex=i;const r=this.trackData.segmentDetails[i],s=typeof(r==null?void 0:r.intensity)=="number"?r.intensity:0;this.segmentIntensityBoost=1+Math.max(0,s)/100;const a=this.deriveSegmentColor(r);return this.segmentColorTarget.copy(a),this.segmentIntensityBoost}registerFeatureVisual(n,e){this.particles.registerFeatureVisual(n,e)}update(n,e,i,r,s){var a;try{this.particles.beginFrame();const o=performance.now(),c=o/1e3,f=this.lastUpdateSeconds===0?1/60:Math.min(.25,Math.max(1/240,c-this.lastUpdateSeconds));this.lastUpdateSeconds=c;const m=Ee.clamp(s??0,0,1),p=this.updateMotionEffects(f,i,r,m),l=this.applySegmentMood(m);this.trackMaterial.emissive.lerp(this.segmentColorTarget,.05),this._colorTmp.copy(this.segmentColorTarget).lerp(this.baseRailColor,.4),this.trackMaterial.color.lerp(this._colorTmp,.05);const d=this._colorTmp2.copy(this.baseGhostTintA).lerp(this.segmentColorTarget,.3),S=this._colorTmp3.copy(this.baseGhostTintB).lerp(this.segmentColorTarget,.6);this.trackTintA.copy(d),this.trackTintB.copy(S);const E=this.atmosphere?this.atmosphere.update({deltaSeconds:f,frame:e,audioFeatures:this.audioFeatures,segmentColor:this.segmentColorTarget,segmentIntensity:l}):1;if(this.passionGain=E,this.segmentIntensityBoost=l*E,this.frameCount++,this.firstUpdateTime===0&&(this.firstUpdateTime=o,this.lastPerformanceCheck=o),!this.isWarmedUp&&o-this.firstUpdateTime>5e3&&(this.isWarmedUp=!0,this.lastPerformanceCheck=o,this.frameCount=0),this.isWarmedUp&&o-this.lastPerformanceCheck>qh){const A=this.frameCount*1e3/(o-this.lastPerformanceCheck);this.lastPerformanceCheck=o,this.frameCount=0,A<Yh&&this.highQualityMode?(this.lowQualitySince===null&&(this.lowQualitySince=o,console.log(`[VisualEffects] Low perf detected: ${A.toFixed(1)} FPS`)),this.lowQualitySince!==null&&o-this.lowQualitySince>=Kh&&(console.log(`[VisualEffects] Performance: ${A.toFixed(1)} FPS - Switching to low quality mode`),this.switchToLowQuality(),this.lowQualitySince=null)):this.lowQualitySince=null}const u=qn*this.segmentIntensityBoost,M=ma*this.segmentIntensityBoost,T=ma*Math.max(1,this.segmentIntensityBoost),x=this.audioFeatures.bass||0;if(e){const A=Ee.clamp(e.bass,0,1);this.targetGlowIntensity=Ee.clamp(u+A*(M-u),qn,T)}else this.targetGlowIntensity=Ee.clamp(u+x*(M-u),qn,T);const b=e?e.energy*2+e.spectralFlux*1.5:this.rawAudioForce;this.gpuAudioForce=Math.max(0,b)*this.segmentIntensityBoost,this.trackMaterial.emissiveIntensity=Ee.lerp(this.trackMaterial.emissiveIntensity,this.targetGlowIntensity,Xh);try{const A=(a=this.scene.userData)==null?void 0:a.lodHint;this.applyLOD(A==="low"?"low":"high")}catch{}this.trackPulse=Math.max(0,this.trackPulse-f*1.4),this.trackPulse=this.particles.driveReactiveParticles({nowSeconds:c,deltaSeconds:f,cameraPosition:i,lookAtPosition:r,audioFeatures:this.audioFeatures,segmentIntensityBoost:this.segmentIntensityBoost,currentLOD:this.highQualityMode?"high":"low",gpuAudioForce:this.gpuAudioForce},this.trackPulse);try{const A=this.trackData&&this.trackData.audioFeatures&&typeof this.trackData.audioFeatures.duration=="number"?Ar(this.trackData.audioFeatures.duration):0,w=A>0?m*A:0;this.handleTimelineEvents(w,f,i,r),this.lastAudioTimeSeconds=w}catch{}try{if(this.trackMaterial){const w=this.isCameraInsideTrack(i)?this.trackInsideOpacity:this.trackDefaultOpacity,R=typeof this.trackMaterial.opacity=="number"?this.trackMaterial.opacity:this.trackDefaultOpacity,_=Ee.lerp(R,w,Math.min(1,f*this.trackOpacityLerpSpeed));this.trackMaterial.opacity=_;const g=_<.995;this.trackMaterial.transparent!==g&&(this.trackMaterial.transparent=g,this.trackMaterial.needsUpdate=!0)}}catch{}if(this.trackShaderUniforms){const A=this.trackShaderUniforms;this.updateUniformSafe(A.trackTime,n,.01),this.updateUniformSafe(A.pulseIntensity,this.trackPulse),this.updateUniformSafe(A.segmentBoost,this.segmentIntensityBoost,.001),this.updateUniformSafe(A.audioFlow,Math.min(1.2,this.gpuAudioForce*.25)),this.updateUniformSafe(A.distortionStrength,Math.min(.6,.2+this.trackPulse*.5+this.segmentIntensityBoost*.1)),this.updateUniformSafe(A.bassIntensity,this.audioFeatures.bass||0),this.updateUniformSafe(A.trebleIntensity,this.audioFeatures.treble||0),this.updateUniformSafe(A.rideSpeed,p,.001),this.updateUniformSafe(A.motionBlur,Math.min(1,p*.12),.001)}if(this.ghostRibbonMaterial){const A=this.ghostRibbonMaterial.uniforms;this.updateUniformSafe(A.time,n,.01),this.updateUniformSafe(A.audioPulse,Math.min(1.8,this.trackPulse*1.1+this.gpuAudioForce*.1)),this.updateColorUniformSafe(A.colorInner,this.trackTintA),this.updateColorUniformSafe(A.colorOuter,this.trackTintB)}this.particles.reclaimExpired(c),this.particles.isGPUEnabled()&&this.updateGPU(f);try{const A=this.camera.getObjectByName("audioGlow");if(A){const w=this.audioFeatures.bass||0,R=.12+this.gpuAudioForce*1.6+w*1.5*this.segmentIntensityBoost;Math.abs(A.intensity-R)>.001&&(A.intensity=Ee.lerp(A.intensity||0,Math.max(0,R),.08)),A.color.lerp(this.segmentColorTarget,.06)}}catch{}this.particles.updatePointsMaterial(this.audioFeatures,this.segmentIntensityBoost,this.segmentColorTarget,this.baseRailColor)}finally{this.releaseTempVectors()}}setAudioForce(n){const e=Math.max(0,n);this.rawAudioForce=e,this.gpuAudioForce=e*this.segmentIntensityBoost}setCurlParams({curlStrength:n,noiseScale:e,noiseSpeed:i}){typeof n=="number"&&(this.curlStrength=n),typeof e=="number"&&(this.noiseScale=e),typeof i=="number"&&(this.noiseSpeed=i)}applyShaderUniform(n,e){n==="curlStrength"?this.curlStrength=e:n==="noiseScale"?this.noiseScale=e:n==="noiseSpeed"&&(this.noiseSpeed=e),this.particles.applyShaderUniform(n,e)}setShaderUniformsFromManifest(n){if(!(!n||typeof n!="object"))for(const[e,i]of Object.entries(n)){if(!i)continue;const r=i.value??i.defaultValue;r!==void 0&&this.applyShaderUniform(e,r)}}applyLOD(n){(n==="low"&&this.highQualityMode||n==="high"&&!this.highQualityMode)&&(n==="low"?this.switchToLowQuality():this.switchToHighQuality())}spawnParticles(n,e,i){this.particles.spawnParticles(n,{origin:e,feature:i,audioFeatures:this.audioFeatures,segmentIntensityBoost:this.segmentIntensityBoost,nowSeconds:performance.now()/1e3})}spawnFeatureBurst(n,e,i){this.particles.spawnFeatureBurst(n,e,i,this.audioFeatures,this.segmentIntensityBoost,performance.now()/1e3)}handleTimelineEvents(n,e,i,r){if(!this.timelineEvents||!this.timelineEvents.length)return;const s=n;if(this._forward.subVectors(r,i),!(this._forward.lengthSq()<1e-6)){this._forward.normalize(),this._right.copy(this._forward).cross(en.UP_VECTOR),this._right.lengthSq()<1e-6?this._right.set(1,0,0):this._right.normalize(),this._up.copy(this._right).cross(this._forward),this._up.lengthSq()<1e-6?this._up.set(0,1,0):this._up.normalize();for(let a=0;a<this.timelineEvents.length;a++){const o=this.timelineEvents[a];if(!o||typeof o.timestamp!="number")continue;const c=this.timelineTriggeredUntil.get(a)||0;if(s<=c)continue;const f=Math.max(.05,e*1.5);if(s+f>=o.timestamp){const m=Math.max(0,Math.min(1,(o.intensity??.6)*(this.segmentIntensityBoost||1)));try{const l=this.getTempVector3().copy(i).addScaledVector(this._forward,8).addScaledVector(this._up,1.5);this.spawnEvent(o,m,l)}catch{}const p=o.duration?typeof o.duration=="number"?o.duration:Number(o.duration):2;this.timelineTriggeredUntil.set(a,o.timestamp+p+.5)}}}}spawnEvent(n,e,i){const r=n.type,s=Math.max(.02,Math.min(1,e));switch(r){case"fireworks":{const a=3+Math.round(s*5);for(let o=0;o<a;o++){const c=this.getTempVector3().set((Math.random()-.5)*6,6+Math.random()*6,(Math.random()-.5)*6),f=this.getTempVector3().copy(i).add(c);this.spawnFeatureBurst("sparkle",s*(.8+Math.random()*.6),f)}try{const o=new Is(this.segmentColorTarget.clone(),0,40,2);o.position.copy(i).add(this.getTempVector3().set(0,6,0)),this.scene.add(o);const c=performance.now()/1e3,f=()=>{const l=performance.now()/1e3-c;if(o.intensity=Math.max(0,6*s*(1-l/.6)),o.intensity<=.01)try{this.scene.remove(o)}catch{}else{const d=requestAnimationFrame(f);this._animationFrameHandles.push(d)}},m=requestAnimationFrame(f);this._animationFrameHandles.push(m)}catch{}break}case"fog":{try{if(this.scene.fog instanceof Va){const a=this.scene.fog.density||.001,o=a+.0025*(.5+s),c=performance.now()/1e3,f=Math.max(3,n.duration||6),m=()=>{const l=performance.now()/1e3,d=Math.min(1,(l-c)/.6);if(this.scene.fog.density=Ee.lerp(a,o,d),l-c<f){const S=requestAnimationFrame(m);this._animationFrameHandles.push(S)}else{const S=performance.now()/1e3,E=()=>{const u=performance.now()/1e3,M=Math.min(1,(u-S)/2);if(this.scene.fog.density=Ee.lerp(o,a,M),M<1){const T=requestAnimationFrame(E);this._animationFrameHandles.push(T)}},h=requestAnimationFrame(E);this._animationFrameHandles.push(h)}},p=requestAnimationFrame(m);this._animationFrameHandles.push(p)}}catch{}for(let a=0;a<Math.max(2,Math.round(4*s));a++){const o=this.getTempVector3().copy(i).add(this.getTempVector3().set((Math.random()-.5)*6,(Math.random()-.2)*2,(Math.random()-.5)*6));this.spawnFeatureBurst("sparkle",.25+Math.random()*.4,o)}break}case"starshow":{const a=30+Math.round(s*80);for(let o=0;o<a;o++){const c=this.getTempVector3().copy(i).add(this.getTempVector3().set((Math.random()-.5)*40,8+Math.random()*20,(Math.random()-.5)*40));this.spawnFeatureBurst("sparkle",.25+Math.random()*s*.6,c)}break}case"lightBurst":{try{const a=this.scene.getObjectByName("audioGlow");a&&(a.intensity=Math.max(a.intensity||0,2*s+(this.gpuAudioForce||0)))}catch{}break}case"sparkRing":{const a=10+Math.round(s*30);for(let o=0;o<a;o++){const c=o/a*Math.PI*2,f=this.getTempVector3().set(Math.cos(c)*(3+Math.random()*2),-1+Math.random()*3,Math.sin(c)*(3+Math.random()*2));this.spawnFeatureBurst("sparkle",.5*s,this.getTempVector3().copy(i).add(f))}break}case"confetti":{const a=30+Math.round(s*60);for(let o=0;o<a;o++){const c=this.getTempVector3().copy(i).add(this.getTempVector3().set((Math.random()-.5)*6,Math.random()*6,(Math.random()-.5)*6));this.spawnParticles(2,c,"sparkle")}break}default:this.spawnFeatureBurst("sparkle",s,i)}}createGhostRibbonMaterial(){return new Ct({uniforms:{time:{value:0},audioPulse:{value:0},colorInner:{value:this.trackTintA},colorOuter:{value:this.trackTintB}},vertexShader:`varying float vPath;
varying float vRadial;
uniform float time;
uniform float audioPulse;
void main() {
  vPath = clamp(uv.y, 0.0, 1.0);
  vRadial = uv.x;
  float shimmer = sin(vPath * 20.0 + time * 2.4) * 0.35;
  float lift = 0.6 + audioPulse * 1.2 + shimmer;
  vec3 displaced = position + normal * lift;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}`,fragmentShader:`varying float vPath;
varying float vRadial;
uniform vec3 colorInner;
uniform vec3 colorOuter;
uniform float audioPulse;
void main() {
  float fade = smoothstep(0.0, 1.0, vPath);
  vec3 tint = mix(colorInner, colorOuter, fade);
  float radial = 1.0 - abs(vRadial * 2.0 - 1.0);
  float softness = pow(radial, 1.6);
  float alpha = clamp((0.35 + audioPulse * 0.65) * softness, 0.0, 1.0);
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(tint, alpha);
}`,transparent:!0,depthWrite:!1,blending:rn,side:Lt})}rebuildGhostRibbon(n,e){if(!this.ghostRibbonMaterial)return;const i=Math.max(6,Math.floor(e)),r=new Ls(n,i,va,6,!1);if(this.ghostRibbonMesh){const s=this.ghostRibbonMesh.geometry;jt.release(s);const a=jt.acquire();a.copy(r),this.ghostRibbonMesh.geometry=a}else{const s=jt.acquire();s.copy(r),this.ghostRibbonMesh=new wt(s,this.ghostRibbonMaterial),this.ghostRibbonMesh.frustumCulled=!0,this.ghostRibbonMesh.renderOrder=9,this.scene.add(this.ghostRibbonMesh)}r.dispose()}switchToLowQuality(){if(!this.highQualityMode)return;this.highQualityMode=!1,this.particles.setQualityProfile("low"),this.particles.registerFeatureVisual("speed",{size:1,lifetime:1.2,sensitivity:.7});const n=this.trackMesh.geometry;jt.release(n),this.rebuildTrackGeometry(),this.createSpeedStreakSystem()}switchToHighQuality(){if(this.highQualityMode)return;this.highQualityMode=!0,this.particles.setQualityProfile("high"),this.particles.registerFeatureVisual("speed",{size:1.4,lifetime:1.8,sensitivity:.8});const n=this.trackMesh.geometry;jt.release(n),this.rebuildTrackGeometry(),this.createSpeedStreakSystem()}dispose(){if(this.trackMesh&&(this.scene.remove(this.trackMesh),jt.release(this.trackMesh.geometry)),this.trackMaterial)try{this.trackMaterial.dispose()}catch{}if(this.ghostRibbonMesh){try{this.scene.remove(this.ghostRibbonMesh),this.ghostRibbonMesh.geometry.dispose()}catch{}this.ghostRibbonMesh=null}if(this.ghostRibbonMaterial){try{this.ghostRibbonMaterial.dispose()}catch{}this.ghostRibbonMaterial=null}if(this.teardownSpeedStreakSystem(),this.tunnelRushMesh){try{this.camera.remove(this.tunnelRushMesh),this.tunnelRushMesh.geometry.dispose()}catch{}this.tunnelRushMesh=null}if(this.tunnelRushMaterial){try{this.tunnelRushMaterial.dispose()}catch{}this.tunnelRushMaterial=null}this.particles.dispose();const n=this.camera.getObjectByName("audioGlow");if(n)try{const e=n.parent;e&&e.remove(n)}catch{}this._animationFrameHandles.forEach(e=>cancelAnimationFrame(e)),this._animationFrameHandles=[]}};N(en,"UP_VECTOR",new z(0,1,0));let Fr=en;const tm=(t,n,e)=>{const i=dt.useRef(null),r=dt.useRef(null),s=dt.useRef(!1);return dt.useEffect(()=>{var a;if(!(!t||!n)){if((a=r.current)==null||a.dispose(),r.current=null,i.current=null,s.current=!1,console.log("[useRide] Track data is available. Building ride visuals..."),n.path.length>1){i.current=new br(t.camera,n),r.current=new Fr(t.scene,n,t.camera),console.log("[useRide] RideCamera and VisualEffects created.");const o=t.renderer;r.current&&o&&!s.current&&(s.current=!0,r.current.initGPU(o).then(()=>console.log("[useRide] GPU particle system ready")).catch(c=>{const f=c instanceof Error?c.message:String(c);console.info("[useRide] GPU particle init skipped",f)}))}return()=>{var o;console.log("[useRide] Cleaning up ride visuals."),(o=r.current)==null||o.dispose(),r.current=null,i.current=null}}},[n,t,e]),{rideCameraRef:i,visualEffectsRef:r}},nm=(t,n)=>{dt.useEffect(()=>{const e=t.current;if(!e)return;const m={"audiorailrider:frame":p=>{try{const l=p.detail;if(!l)return;const d=x=>Math.max(0,Math.min(1,x)),S=l.spectralFlux??0,E=l.spectralCentroid??0,h=l.energy??0,u=l.bass??0,M=l.mid??0,T=l.high??0;e.setAudioFeatures({subBass:d(u*.75),bass:d(u),lowMid:d(M*.85),mid:d(M),highMid:d(M*.4+T*.6),treble:d(T),sparkle:d(S*.6+E/6e3+h*.1)}),e.setAudioForce(h*2+S*1.5)}catch{}},"audiorailrider:dev:setCurlParams":p=>{const l=p.detail;l&&e.setCurlParams({curlStrength:l.curlStrength,noiseScale:l.noiseScale,noiseSpeed:l.noiseSpeed})},"audiorailrider:dev:applyUniform":p=>{const l=p.detail;l&&e.applyShaderUniform(l.name,l.value)},"audiorailrider:dev:loadUniformsManifest":async()=>{try{const p=await fetch("/shaders/shader-uniforms.json");if(!p.ok)return;const l=await p.json();e.setShaderUniformsFromManifest(l)}catch(p){console.error("[useGlobalEventListeners] Failed to load shader manifest:",p)}},"audiorailrider:dev:setTrackSettings":p=>{const l=p.detail;if(!l)return;typeof e.setTrackSettings=="function"&&e.setTrackSettings(l);const d=n.current;d&&typeof d.setTrackRadius=="function"&&typeof l.trackRadius=="number"&&d.setTrackRadius(l.trackRadius)},"audiorailrider:dev:forceTrackInside":p=>{const l=p.detail;l&&typeof e.forceTrackInside=="function"&&e.forceTrackInside(!!l.force)},"audiorailrider:dev:rebuildTrack":()=>{typeof e.rebuildTrackGeometry=="function"&&e.rebuildTrackGeometry()}};return console.log("[useGlobalEventListeners] Adding event listeners."),Object.entries(m).forEach(([p,l])=>{window.addEventListener(p,l)}),()=>{console.log("[useGlobalEventListeners] Removing event listeners."),Object.entries(m).forEach(([p,l])=>{window.removeEventListener(p,l)})}},[t,n])},im=50,rm=(t,n,e,i,r,s,a)=>{const o=dt.useRef(null);dt.useEffect(()=>{if(t===Un.Idle||!n||!i||!r||!s){o.current&&(console.log("[useAnimationLoop] Stopping animation loop."),cancelAnimationFrame(o.current),o.current=null);return}console.log("[useAnimationLoop] Starting animation loop.");const c=new Vc;let f=0,m=-1;const p=()=>{o.current=requestAnimationFrame(p);const l=c.getElapsedTime(),d=(e==null?void 0:e.currentTime)||0,S=e==null?void 0:e.duration,E=S&&isFinite(S)?S:n.path.length/im,h=t===Un.Riding?d/E:l*.05%1;if(t===Un.Riding&&h>=1){a();return}if(t===Un.Riding){const u=Math.floor(h*20)/20;u!==m&&(m=u,console.log("[useAnimationLoop] Ride progress",{progress:Number(h.toFixed(3)),audioTime:Number(d.toFixed(2)),duration:Number(E.toFixed(2))}))}try{r.update(h);let u=null;if(n.frameAnalyses&&n.frameAnalyses.length>0){for(;f<n.frameAnalyses.length-1&&n.frameAnalyses[f].timestamp<d;)f++;u=n.frameAnalyses[f]}s.update(l,u,i.camera.position,r.lookAtPos,Math.max(0,Math.min(1,h))),i.render()}catch(u){console.error("Error during animation frame:",u),o.current&&cancelAnimationFrame(o.current)}};return p(),()=>{o.current&&(cancelAnimationFrame(o.current),o.current=null)}},[t,n,e,i,r,s,a])},sm=(t,n)=>({timestamp:Hc(t),energy:n.energy,spectralCentroid:n.spectralCentroid,spectralFlux:n.spectralFlux,bass:n.bass,mid:n.mid,high:n.high,sampleRate:n.sampleRate,channelCount:n.channelCount,frame:n.frame}),ti={latestFrame:null,isNew:!1},am=t=>{ti.latestFrame=t,ti.isNew=!0},om=()=>ti.isNew?(ti.isNew=!1,ti.latestFrame):null,zr=()=>{try{return typeof globalThis.AudioWorkletNode<"u"}catch{return!1}},cm=()=>`
  class SimpleAnalyzerProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this._prevMagnitudes = null;
      this.port.onmessage = (ev) => {};
    }

    _fft(re, im) {
      const n = re.length;
      const levels = Math.floor(Math.log2(n));
      for (let i = 0; i < n; i++) {
        let j = 0;
        for (let k = 0; k < levels; k++) j = (j << 1) | ((i >> k) & 1);
        if (j > i) { const tr = re[i]; re[i] = re[j]; re[j] = tr; const ti = im[i]; im[i] = im[j]; im[j] = ti; }
      }
      for (let size = 2; size <= n; size <<= 1) {
        const half = size >> 1;
        const theta = -2 * Math.PI / size;
        const wMulRe = Math.cos(theta);
        const wMulIm = Math.sin(theta);
        for (let i = 0; i < n; i += size) {
          let wr = 1.0, wi = 0.0;
          for (let j = 0; j < half; j++) {
            const idx1 = i + j; const idx2 = i + j + half;
            const tr = wr * re[idx2] - wi * im[idx2];
            const ti = wr * im[idx2] + wi * re[idx2];
            re[idx2] = re[idx1] - tr; im[idx2] = im[idx1] - ti;
            re[idx1] = re[idx1] + tr; im[idx1] = im[idx1] + ti;
            const newWr = wr * wMulRe - wi * wMulIm;
            const newWi = wr * wMulIm + wi * wMulRe;
            wr = newWr; wi = newWi;
          }
        }
      }
    }

    process(inputs, outputs) {
      try {
        const input = inputs[0];
        const output = outputs[0];
        if (!input || !input[0]) return true;
  const frame = input[0]; const N = frame.length;
        let energy = 0; for (let i = 0; i < N; i++) energy += frame[i]*frame[i]; energy = energy / N;
        const re = new Float32Array(N); const im = new Float32Array(N);
        for (let i = 0; i < N; i++) { re[i] = frame[i]; im[i] = 0.0; }
        this._fft(re, im);
        const half = N >> 1; const mags = new Float32Array(half);
        for (let k = 0; k < half; k++) { const r = re[k]; const i2 = im[k]; mags[k] = Math.hypot(r, i2); }
        let num = 0, den = 0; for (let k = 0; k < mags.length; k++) { num += k * mags[k]; den += mags[k]; }
        const spectralCentroid = den > 0 ? num / den : 0;
        let flux = 0; if (this._prevMagnitudes) { const L = Math.min(this._prevMagnitudes.length, mags.length); for (let k = 0; k < L; k++) { const d = mags[k] - this._prevMagnitudes[k]; flux += d > 0 ? d : 0; } }
        const bassRange = Math.floor(mags.length * 0.15); const midRange = Math.floor(mags.length * 0.6);
        let bass = 0, mid = 0, high = 0; for (let k = 0; k < mags.length; k++) { if (k < bassRange) bass += mags[k]; else if (k < midRange) mid += mags[k]; else high += mags[k]; }
        const total = bass + mid + high || 1; bass /= total; mid /= total; high /= total;
        this._prevMagnitudes = mags;
        const frameCopy = frame.slice();
        this.port.postMessage(
          {
            type: 'analysis',
            timestamp: currentTime,
            energy: energy,
            spectralCentroid: spectralCentroid,
            spectralFlux: flux,
            bass: bass,
            mid: mid,
            high: high,
            frame: frameCopy,
            sampleRate: sampleRate,
            channelCount: input.length,
          },
          [frameCopy.buffer]
        );
        if (output) {
          const channelCount = Math.min(output.length, input.length);
          for (let ch = 0; ch < channelCount; ch++) {
            output[ch].set(input[ch]);
          }
        }
      } catch (e) {}
      return true;
    }
  }
  registerProcessor('simple-analyzer-processor', SimpleAnalyzerProcessor);
`,lm=async t=>{if(!zr())return Promise.resolve();const n="/worklets/analyzer-processor.js";try{await t.audioWorklet.addModule(n);return}catch(s){console.info("[audioWorklet] static module load failed, falling back to inline blob",s&&s.message?s.message:s)}const e=`
  ${cm()}
  `,i=new Blob([e],{type:"application/javascript"}),r=URL.createObjectURL(i);try{await t.audioWorklet.addModule(r)}finally{try{URL.revokeObjectURL(r)}catch{}}},um=t=>{if(!zr())return null;try{const n=new AudioWorkletNode(t,"simple-analyzer-processor");return n.port.onmessage=e=>{const i=e.data;if(!(!i||i.type!=="analysis"))try{const r=i.frame instanceof Float32Array?i.frame:i.frame?new Float32Array(i.frame):void 0;am({timestamp:i.timestamp,energy:i.energy,spectralCentroid:i.spectralCentroid,spectralFlux:i.spectralFlux,bass:i.bass,mid:i.mid,high:i.high,frame:r,sampleRate:typeof i.sampleRate=="number"?i.sampleRate:t.sampleRate,channelCount:typeof i.channelCount=="number"?i.channelCount:1})}catch(r){console.warn("[audioWorklet] Failed to process and set latest frame",r)}},n}catch(n){return console.warn("[audioWorklet] createAnalyzerNode failed",n),null}},fm=async t=>{if(!zr())return null;try{return await lm(t),um(t)}catch(n){return console.warn("[audioProcessor] createWorkletAnalyzerForContext failed",n),null}};class dm{constructor(){N(this,"audioContext",null);N(this,"workletNode",null);N(this,"sourceNode",null)}async initialize(n){this.audioContext&&await this.dispose();const e=new(window.AudioContext||window.webkitAudioContext);this.audioContext=e;try{e.state==="suspended"&&await e.resume();const i=e.createMediaElementSource(n);this.sourceNode=i;const r=await fm(e);this.workletNode=r,r?(i.connect(r),r.connect(e.destination)):i.connect(e.destination)}catch(i){throw console.error("[LiveAudioProcessor] Initialization failed:",i),await this.dispose(),i}}async dispose(){if(this.workletNode){try{this.workletNode.disconnect()}catch(n){console.warn("[LiveAudioProcessor] Error disconnecting worklet node:",n)}this.workletNode=null}if(this.sourceNode){try{this.sourceNode.disconnect()}catch(n){console.warn("[LiveAudioProcessor] Error disconnecting source node:",n)}this.sourceNode=null}if(this.audioContext&&this.audioContext.state!=="closed")try{await this.audioContext.close()}catch(n){console.warn("[LiveAudioProcessor] Error closing AudioContext:",n)}this.audioContext=null}}const pm=({audioFile:t,status:n})=>{const e=dt.useRef(null),i=dt.useRef(null),r=dt.useRef(null);return dt.useEffect(()=>{console.log("[useAudioAnalysis] Effect triggered",{status:n,hasAudioFile:!!t});const s=()=>{i.current&&(cancelAnimationFrame(i.current),i.current=null),e.current&&(console.log("[useAudioAnalysis] Cleaning up audio element"),e.current.pause(),e.current.src.startsWith("blob:")&&URL.revokeObjectURL(e.current.src),e.current=null),r.current&&(console.log("[useAudioAnalysis] Disposing LiveAudioProcessor"),r.current.dispose(),r.current=null)};if(n!==Un.Riding||!t){s();return}console.log("[useAudioAnalysis] Setting up audio for riding");const a=new Audio(URL.createObjectURL(t));a.loop=!1,a.preload="auto",a.addEventListener("loadeddata",()=>console.log("[useAudioAnalysis] Audio loaded",{duration:a.duration})),a.addEventListener("playing",()=>console.log("[useAudioAnalysis] Audio is playing")),a.addEventListener("pause",()=>console.log("[useAudioAnalysis] Audio paused")),a.addEventListener("error",b=>console.error("[useAudioAnalysis] Audio error",b)),e.current=a;const o=[],c=[],f=[],m=[],p=64,l=.2,d=2.5,S=3;let E=-1/0,h=-1/0,u=0;const M=(b,A)=>{b.push(A),b.length>p&&b.shift()},T=b=>{const A=Ar(b.timestamp),w=Math.max(0,Math.min(1,b.energy));M(o,w),M(c,b.spectralCentroid),M(f,b.spectralFlux);const R=o.reduce((U,I)=>U+I,0)/o.length,_=o.reduce((U,I)=>{const B=I-R;return U+B*B},0)/Math.max(1,o.length-1),g=Math.sqrt(Math.max(_,0)),P=R+g*.75;if(w>P&&A-E>=l){try{window.dispatchEvent(new CustomEvent("audiorailrider:beat",{detail:{timestamp:A,energy:w}}))}catch{}if(E>-1/0){const U=A-E;if(U>.1&&U<3){M(m,U);const I=m.reduce((B,X)=>B+X,0)/m.length;if(I>0){const B=60/I;u=u>0?u*.6+B*.4:B;try{window.dispatchEvent(new CustomEvent("audiorailrider:tempo",{detail:{tempo:u}}))}catch{}}}}E=A}if(f.length>=4&&c.length>=4){const U=Math.abs(b.spectralFlux-f[f.length-2]),I=Math.abs(b.spectralCentroid-c[c.length-2]),B=f.reduce((Re,Oe)=>Re+Oe,0)/f.length,X=c.reduce((Re,Oe)=>Re+Oe,0)/c.length,G=Math.sqrt(f.reduce((Re,Oe)=>{const qe=Oe-B;return Re+qe*qe},0)/Math.max(1,f.length-1)),ee=Math.sqrt(c.reduce((Re,Oe)=>{const qe=Oe-X;return Re+qe*qe},0)/Math.max(1,c.length-1)),W=G>0?U/G:0,fe=ee>0?I/ee:0,ye=W*.6+fe*.4;if(ye>d&&A-h>S){h=A;try{window.dispatchEvent(new CustomEvent("audiorailrider:structure",{detail:{timestamp:A,structuralScore:ye}}))}catch{}}}};return(async()=>{try{const b=new dm;r.current=b,await b.initialize(a);const A=()=>{const w=om();if(w){const R=sm(w.timestamp,w);T(R);try{const _=new CustomEvent("audiorailrider:frame",{detail:R});window.dispatchEvent(_)}catch{}}i.current=requestAnimationFrame(A)};A()}catch(b){console.warn("[useAudioAnalysis] Audio processing setup failed, playing audio directly.",b)}console.log("[useAudioAnalysis] Starting audio playback"),a.play().then(()=>console.log("[useAudioAnalysis] Audio playing successfully")).catch(b=>console.error("[useAudioAnalysis] Audio playback failed:",b))})(),s},[t,n]),{audioRef:e}},hm=({mountRef:t})=>{const n=Yt(d=>d.status),e=Yt(d=>d.blueprint),i=Yt(d=>d.audioFeatures),r=Yt(d=>d.trackData),s=Yt(d=>d.audioFile),a=Yt(d=>d.skyboxUrl),o=Yt(d=>d.actions.handleRideFinish),c=bp(),f=Cp(t);Op(e,i);const{audioRef:m}=pm({audioFile:s,status:n}),{rideCameraRef:p,visualEffectsRef:l}=tm(f.current,r,c);return nm(l,p),rm(n,r,m.current,f.current,p.current,l.current,o),dt.useEffect(()=>{const d=f.current;if(!(!d||!a))try{console.log("[ThreeCanvasCore] Applying skybox from store",a),d.updateSkybox(a)}catch(S){console.warn("[ThreeCanvasCore] Failed to apply skybox from store",S)}},[a,f]),null},mm=()=>{const t=Yt(e=>e.status),n=dt.useRef(null);return Zr.jsx("div",{ref:n,className:"fixed inset-0 z-10 w-full h-full",style:{opacity:t===Un.Riding?1:.5},children:Zr.jsx(hm,{mountRef:n})})},Mm=dt.memo(mm);export{Mm as default};

var Lg=Object.defineProperty;var Bg=(t,i,a)=>i in t?Lg(t,i,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[i]=a;var ie=(t,i,a)=>Bg(t,typeof i!="symbol"?i+"":i,a);import{r as St,a as Og,j as ks,e as Yh}from"./index-B3dOLY_1.js";import{c as Ig,N as sa,S as vn,C as at,F as Kh,V as le,R as Gu,a as An,w as _u,M as Bn,W as fp,b as $t,d as nn,L as Fr,H as Kr,U as Cn,D as Rn,B as gn,e as Pa,f as js,p as Fg,E as pl,g as Ye,P as Ws,A as Hg,h as zc,i as bn,j as kr,k as Vu,l as Ys,m as Ks,n as Xu,o as zg,q as ba,r as rl,s as Gg,t as Vg,u as Cr,O as Xg,v as Wg,x as qg,y as kg,z as Yg,G as Kg,I as Qg,J as Zg,K as jg,Q as Jg,T as $g,X as e_,Y as t_,Z as n_,_ as i_,$ as a_,a0 as s_,a1 as Qh,a2 as Gc,a3 as Hi,a4 as No,a5 as r_,a6 as yi,a7 as o_,a8 as l_,a9 as c_,aa as u_,ab as Zh,ac as f_,ad as d_,ae as p_,af as Wu,ag as xt,ah as h_,ai as m_,aj as v_,ak as rn,al as as,am as ii,an as gi,ao as jh,ap as Xn,aq as ta,ar as ol,as as Jh,at as $h,au as em,av as ll,aw as g_,ax as __,ay as S_,az as E_,aA as tm,aB as _i,aC as T_,aD as M_,aE as qu,aF as nm,aG as im,aH as am,aI as sm,aJ as Vc,aK as Xc,aL as Wc,aM as qc,aN as Vt,aO as dp,aP as pp,aQ as hp,aR as mp,aS as vp,aT as gp,aU as _p,aV as Sp,aW as Ep,aX as Tp,aY as Mp,aZ as yp,a_ as xp,a$ as Ap,b0 as Rp,b1 as bp,b2 as Up,b3 as Cp,b4 as Dp,b5 as wp,b6 as Pp,b7 as Np,b8 as Lp,b9 as Bp,ba as Op,bb as Ip,bc as Fp,bd as Hp,be as Su,bf as Eu,bg as Tu,bh as Mu,bi as yu,bj as cl,bk as xu,bl as y_,bm as zp,bn as x_,bo as nl,bp as A_,bq as Gp,br as Vp,bs as qs,bt as ul,bu as Au,bv as R_,bw as rm,bx as b_,by as Gn,bz as hl,bA as U_,bB as C_,bC as om,bD as lm,bE as Xp,bF as cm,bG as Wp,bH as um,bI as Yr,bJ as Qs,bK as ku,bL as fm,bM as D_,bN as w_,bO as P_,bP as qp,bQ as N_,bR as L_,bS as B_,bT as O_,bU as I_,bV as F_,bW as H_,bX as z_,bY as G_,bZ as V_,b_ as X_,b$ as Yu,c0 as W_,c1 as q_,c2 as k_,c3 as Y_,c4 as K_,c5 as Q_,c6 as Z_,c7 as Js,c8 as fl,c9 as it,ca as dm,cb as Ru,cc as Xt,cd as ft,ce as kc,cf as j_,cg as J_,ch as kp,ci as $_,cj as ia,ck as eS,cl as bu,cm as ra,cn as Hr,co as tS,cp as zi,cq as nS,cr as iS,cs as aS,ct as sS,cu as Lo,cv as rS,cw as oS,cx as lS,cy as cS,cz as Dr,cA as uS,cB as fS,cC as dS,cD as pS,cE as zr,cF as hS,cG as mS}from"./SafeAppWrapper-OMYvMr9-.js";import"./ToastProvider-BgtHwpgo.js";/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function pm(){let t=null,i=!1,a=null,r=null;function o(c,u){a(c,u),r=t.requestAnimationFrame(o)}return{start:function(){i!==!0&&a!==null&&(r=t.requestAnimationFrame(o),i=!0)},stop:function(){t.cancelAnimationFrame(r),i=!1},setAnimationLoop:function(c){a=c},setContext:function(c){t=c}}}function vS(t){const i=new WeakMap;function a(d,p){const g=d.array,E=d.usage,_=g.byteLength,v=t.createBuffer();t.bindBuffer(p,v),t.bufferData(p,g,E),d.onUploadCallback();let S;if(g instanceof Float32Array)S=t.FLOAT;else if(typeof Float16Array<"u"&&g instanceof Float16Array)S=t.HALF_FLOAT;else if(g instanceof Uint16Array)d.isFloat16BufferAttribute?S=t.HALF_FLOAT:S=t.UNSIGNED_SHORT;else if(g instanceof Int16Array)S=t.SHORT;else if(g instanceof Uint32Array)S=t.UNSIGNED_INT;else if(g instanceof Int32Array)S=t.INT;else if(g instanceof Int8Array)S=t.BYTE;else if(g instanceof Uint8Array)S=t.UNSIGNED_BYTE;else if(g instanceof Uint8ClampedArray)S=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+g);return{buffer:v,type:S,bytesPerElement:g.BYTES_PER_ELEMENT,version:d.version,size:_}}function r(d,p,g){const E=p.array,_=p.updateRanges;if(t.bindBuffer(g,d),_.length===0)t.bufferSubData(g,0,E);else{_.sort((S,U)=>S.start-U.start);let v=0;for(let S=1;S<_.length;S++){const U=_[v],w=_[S];w.start<=U.start+U.count+1?U.count=Math.max(U.count,w.start+w.count-U.start):(++v,_[v]=w)}_.length=v+1;for(let S=0,U=_.length;S<U;S++){const w=_[S];t.bufferSubData(g,w.start*E.BYTES_PER_ELEMENT,E,w.start,w.count)}p.clearUpdateRanges()}p.onUploadCallback()}function o(d){return d.isInterleavedBufferAttribute&&(d=d.data),i.get(d)}function c(d){d.isInterleavedBufferAttribute&&(d=d.data);const p=i.get(d);p&&(t.deleteBuffer(p.buffer),i.delete(d))}function u(d,p){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const E=i.get(d);(!E||E.version<d.version)&&i.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const g=i.get(d);if(g===void 0)i.set(d,a(d,p));else if(g.version<d.version){if(g.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(g.buffer,d,p),g.version=d.version}}return{get:o,remove:c,update:u}}var gS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_S=`#ifdef USE_ALPHAHASH
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
#endif`,SS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ES=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,TS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,MS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,yS=`#ifdef USE_AOMAP
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
#endif`,xS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,AS=`#ifdef USE_BATCHING
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
#endif`,RS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,bS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,US=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,CS=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,DS=`#ifdef USE_IRIDESCENCE
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
#endif`,wS=`#ifdef USE_BUMPMAP
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
#endif`,PS=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,NS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,LS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,BS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,OS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,IS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,FS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,HS=`#if defined( USE_COLOR_ALPHA )
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
#endif`,zS=`#define PI 3.141592653589793
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
} // validated`,GS=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,VS=`vec3 transformedNormal = objectNormal;
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
#endif`,XS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,WS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,kS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,YS="gl_FragColor = linearToOutputTexel( gl_FragColor );",KS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,QS=`#ifdef USE_ENVMAP
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
#endif`,ZS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,jS=`#ifdef USE_ENVMAP
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
#endif`,JS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$S=`#ifdef USE_ENVMAP
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
#endif`,e0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,t0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,n0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,i0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,a0=`#ifdef USE_GRADIENTMAP
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
}`,s0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,r0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,o0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,l0=`uniform bool receiveShadow;
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
#endif`,c0=`#ifdef USE_ENVMAP
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
#endif`,u0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,f0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,d0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,p0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,h0=`PhysicalMaterial material;
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
#endif`,m0=`struct PhysicalMaterial {
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
}`,v0=`
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
#endif`,g0=`#if defined( RE_IndirectDiffuse )
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
#endif`,_0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,S0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,E0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,T0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,M0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,y0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,x0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,A0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,R0=`#if defined( USE_POINTS_UV )
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
#endif`,b0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,U0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,C0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,D0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,w0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,P0=`#ifdef USE_MORPHTARGETS
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
#endif`,N0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,L0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,B0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,O0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,I0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,F0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,H0=`#ifdef USE_NORMALMAP
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
#endif`,z0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,G0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,V0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,X0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,W0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,q0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,k0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Y0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,K0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Q0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Z0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,j0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,J0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
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
#endif`,$0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,eE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,tE=`float getShadowMask() {
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
}`,nE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,iE=`#ifdef USE_SKINNING
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
#endif`,aE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,sE=`#ifdef USE_SKINNING
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
#endif`,rE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,oE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,lE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cE=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,uE=`#ifdef USE_TRANSMISSION
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
#endif`,fE=`#ifdef USE_TRANSMISSION
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
#endif`,dE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,gE=`uniform sampler2D t2D;
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
}`,_E=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,SE=`#ifdef ENVMAP_TYPE_CUBE
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
}`,EE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,TE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ME=`#include <common>
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
}`,yE=`#if DEPTH_PACKING == 3200
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,xE=`#define DISTANCE
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
}`,AE=`#define DISTANCE
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
}`,RE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,bE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,UE=`uniform float scale;
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
}`,CE=`uniform vec3 diffuse;
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
}`,DE=`#include <common>
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
}`,wE=`uniform vec3 diffuse;
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
}`,PE=`#define LAMBERT
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
}`,NE=`#define LAMBERT
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
}`,LE=`#define MATCAP
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
}`,BE=`#define MATCAP
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
}`,OE=`#define NORMAL
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
}`,IE=`#define NORMAL
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
}`,FE=`#define PHONG
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
}`,HE=`#define PHONG
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
}`,zE=`#define STANDARD
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
}`,GE=`#define STANDARD
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
}`,VE=`#define TOON
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
}`,XE=`#define TOON
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
}`,WE=`uniform float size;
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
}`,qE=`uniform vec3 diffuse;
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
}`,kE=`#include <common>
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
}`,YE=`uniform vec3 color;
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
}`,KE=`uniform float rotation;
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
}`,QE=`uniform vec3 diffuse;
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
}`,rt={alphahash_fragment:gS,alphahash_pars_fragment:_S,alphamap_fragment:SS,alphamap_pars_fragment:ES,alphatest_fragment:TS,alphatest_pars_fragment:MS,aomap_fragment:yS,aomap_pars_fragment:xS,batching_pars_vertex:AS,batching_vertex:RS,begin_vertex:bS,beginnormal_vertex:US,bsdfs:CS,iridescence_fragment:DS,bumpmap_pars_fragment:wS,clipping_planes_fragment:PS,clipping_planes_pars_fragment:NS,clipping_planes_pars_vertex:LS,clipping_planes_vertex:BS,color_fragment:OS,color_pars_fragment:IS,color_pars_vertex:FS,color_vertex:HS,common:zS,cube_uv_reflection_fragment:GS,defaultnormal_vertex:VS,displacementmap_pars_vertex:XS,displacementmap_vertex:WS,emissivemap_fragment:qS,emissivemap_pars_fragment:kS,colorspace_fragment:YS,colorspace_pars_fragment:KS,envmap_fragment:QS,envmap_common_pars_fragment:ZS,envmap_pars_fragment:jS,envmap_pars_vertex:JS,envmap_physical_pars_fragment:c0,envmap_vertex:$S,fog_vertex:e0,fog_pars_vertex:t0,fog_fragment:n0,fog_pars_fragment:i0,gradientmap_pars_fragment:a0,lightmap_pars_fragment:s0,lights_lambert_fragment:r0,lights_lambert_pars_fragment:o0,lights_pars_begin:l0,lights_toon_fragment:u0,lights_toon_pars_fragment:f0,lights_phong_fragment:d0,lights_phong_pars_fragment:p0,lights_physical_fragment:h0,lights_physical_pars_fragment:m0,lights_fragment_begin:v0,lights_fragment_maps:g0,lights_fragment_end:_0,logdepthbuf_fragment:S0,logdepthbuf_pars_fragment:E0,logdepthbuf_pars_vertex:T0,logdepthbuf_vertex:M0,map_fragment:y0,map_pars_fragment:x0,map_particle_fragment:A0,map_particle_pars_fragment:R0,metalnessmap_fragment:b0,metalnessmap_pars_fragment:U0,morphinstance_vertex:C0,morphcolor_vertex:D0,morphnormal_vertex:w0,morphtarget_pars_vertex:P0,morphtarget_vertex:N0,normal_fragment_begin:L0,normal_fragment_maps:B0,normal_pars_fragment:O0,normal_pars_vertex:I0,normal_vertex:F0,normalmap_pars_fragment:H0,clearcoat_normal_fragment_begin:z0,clearcoat_normal_fragment_maps:G0,clearcoat_pars_fragment:V0,iridescence_pars_fragment:X0,opaque_fragment:W0,packing:q0,premultiplied_alpha_fragment:k0,project_vertex:Y0,dithering_fragment:K0,dithering_pars_fragment:Q0,roughnessmap_fragment:Z0,roughnessmap_pars_fragment:j0,shadowmap_pars_fragment:J0,shadowmap_pars_vertex:$0,shadowmap_vertex:eE,shadowmask_pars_fragment:tE,skinbase_vertex:nE,skinning_pars_vertex:iE,skinning_vertex:aE,skinnormal_vertex:sE,specularmap_fragment:rE,specularmap_pars_fragment:oE,tonemapping_fragment:lE,tonemapping_pars_fragment:cE,transmission_fragment:uE,transmission_pars_fragment:fE,uv_pars_fragment:dE,uv_pars_vertex:pE,uv_vertex:hE,worldpos_vertex:mE,background_vert:vE,background_frag:gE,backgroundCube_vert:_E,backgroundCube_frag:SE,cube_vert:EE,cube_frag:TE,depth_vert:ME,depth_frag:yE,distanceRGBA_vert:xE,distanceRGBA_frag:AE,equirect_vert:RE,equirect_frag:bE,linedashed_vert:UE,linedashed_frag:CE,meshbasic_vert:DE,meshbasic_frag:wE,meshlambert_vert:PE,meshlambert_frag:NE,meshmatcap_vert:LE,meshmatcap_frag:BE,meshnormal_vert:OE,meshnormal_frag:IE,meshphong_vert:FE,meshphong_frag:HE,meshphysical_vert:zE,meshphysical_frag:GE,meshtoon_vert:VE,meshtoon_frag:XE,points_vert:WE,points_frag:qE,shadow_vert:kE,shadow_frag:YE,sprite_vert:KE,sprite_frag:QE},Ae={common:{diffuse:{value:new at(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new xt},alphaMap:{value:null},alphaMapTransform:{value:new xt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new xt}},envmap:{envMap:{value:null},envMapRotation:{value:new xt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new xt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new xt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new xt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new xt},normalScale:{value:new Ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new xt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new xt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new xt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new xt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new at(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new at(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new xt},alphaTest:{value:0},uvTransform:{value:new xt}},sprite:{diffuse:{value:new at(16777215)},opacity:{value:1},center:{value:new Ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new xt},alphaMap:{value:null},alphaMapTransform:{value:new xt},alphaTest:{value:0}}},Ii={basic:{uniforms:Gn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.fog]),vertexShader:rt.meshbasic_vert,fragmentShader:rt.meshbasic_frag},lambert:{uniforms:Gn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new at(0)}}]),vertexShader:rt.meshlambert_vert,fragmentShader:rt.meshlambert_frag},phong:{uniforms:Gn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new at(0)},specular:{value:new at(1118481)},shininess:{value:30}}]),vertexShader:rt.meshphong_vert,fragmentShader:rt.meshphong_frag},standard:{uniforms:Gn([Ae.common,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.roughnessmap,Ae.metalnessmap,Ae.fog,Ae.lights,{emissive:{value:new at(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag},toon:{uniforms:Gn([Ae.common,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.gradientmap,Ae.fog,Ae.lights,{emissive:{value:new at(0)}}]),vertexShader:rt.meshtoon_vert,fragmentShader:rt.meshtoon_frag},matcap:{uniforms:Gn([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,{matcap:{value:null}}]),vertexShader:rt.meshmatcap_vert,fragmentShader:rt.meshmatcap_frag},points:{uniforms:Gn([Ae.points,Ae.fog]),vertexShader:rt.points_vert,fragmentShader:rt.points_frag},dashed:{uniforms:Gn([Ae.common,Ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:rt.linedashed_vert,fragmentShader:rt.linedashed_frag},depth:{uniforms:Gn([Ae.common,Ae.displacementmap]),vertexShader:rt.depth_vert,fragmentShader:rt.depth_frag},normal:{uniforms:Gn([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,{opacity:{value:1}}]),vertexShader:rt.meshnormal_vert,fragmentShader:rt.meshnormal_frag},sprite:{uniforms:Gn([Ae.sprite,Ae.fog]),vertexShader:rt.sprite_vert,fragmentShader:rt.sprite_frag},background:{uniforms:{uvTransform:{value:new xt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:rt.background_vert,fragmentShader:rt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new xt}},vertexShader:rt.backgroundCube_vert,fragmentShader:rt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:rt.cube_vert,fragmentShader:rt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:rt.equirect_vert,fragmentShader:rt.equirect_frag},distanceRGBA:{uniforms:Gn([Ae.common,Ae.displacementmap,{referencePosition:{value:new le},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:rt.distanceRGBA_vert,fragmentShader:rt.distanceRGBA_frag},shadow:{uniforms:Gn([Ae.lights,Ae.fog,{color:{value:new at(0)},opacity:{value:1}}]),vertexShader:rt.shadow_vert,fragmentShader:rt.shadow_frag}};Ii.physical={uniforms:Gn([Ii.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new xt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new xt},clearcoatNormalScale:{value:new Ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new xt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new xt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new xt},sheen:{value:0},sheenColor:{value:new at(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new xt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new xt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new xt},transmissionSamplerSize:{value:new Ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new xt},attenuationDistance:{value:0},attenuationColor:{value:new at(0)},specularColor:{value:new at(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new xt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new xt},anisotropyVector:{value:new Ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new xt}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag};const Bo={r:0,b:0,g:0},$a=new cm,ZE=new Bn;function jE(t,i,a,r,o,c,u){const d=new at(0);let p=c===!0?0:1,g,E,_=null,v=0,S=null;function U(R){let b=R.isScene===!0?R.background:null;return b&&b.isTexture&&(b=(R.backgroundBlurriness>0?a:i).get(b)),b}function w(R){let b=!1;const P=U(R);P===null?m(d,p):P&&P.isColor&&(m(P,1),b=!0);const N=t.xr.getEnvironmentBlendMode();N==="additive"?r.buffers.color.setClear(0,0,0,1,u):N==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,u),(t.autoClear||b)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function T(R,b){const P=U(b);P&&(P.isCubeTexture||P.mapping===hl)?(E===void 0&&(E=new gi(new lm(1,1,1),new rn({name:"BackgroundCubeMaterial",uniforms:Xp(Ii.backgroundCube.uniforms),vertexShader:Ii.backgroundCube.vertexShader,fragmentShader:Ii.backgroundCube.fragmentShader,side:gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),E.geometry.deleteAttribute("normal"),E.geometry.deleteAttribute("uv"),E.onBeforeRender=function(N,O,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(E.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),o.update(E)),$a.copy(b.backgroundRotation),$a.x*=-1,$a.y*=-1,$a.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&($a.y*=-1,$a.z*=-1),E.material.uniforms.envMap.value=P,E.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,E.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,E.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,E.material.uniforms.backgroundRotation.value.setFromMatrix4(ZE.makeRotationFromEuler($a)),E.material.toneMapped=nn.getTransfer(P.colorSpace)!==Vt,(_!==P||v!==P.version||S!==t.toneMapping)&&(E.material.needsUpdate=!0,_=P,v=P.version,S=t.toneMapping),E.layers.enableAll(),R.unshift(E,E.geometry,E.material,0,0,null)):P&&P.isTexture&&(g===void 0&&(g=new gi(new ll(2,2),new rn({name:"BackgroundMaterial",uniforms:Xp(Ii.background.uniforms),vertexShader:Ii.background.vertexShader,fragmentShader:Ii.background.fragmentShader,side:Pa,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),g.geometry.deleteAttribute("normal"),Object.defineProperty(g.material,"map",{get:function(){return this.uniforms.t2D.value}}),o.update(g)),g.material.uniforms.t2D.value=P,g.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,g.material.toneMapped=nn.getTransfer(P.colorSpace)!==Vt,P.matrixAutoUpdate===!0&&P.updateMatrix(),g.material.uniforms.uvTransform.value.copy(P.matrix),(_!==P||v!==P.version||S!==t.toneMapping)&&(g.material.needsUpdate=!0,_=P,v=P.version,S=t.toneMapping),g.layers.enableAll(),R.unshift(g,g.geometry,g.material,0,0,null))}function m(R,b){R.getRGB(Bo,om(t)),r.buffers.color.setClear(Bo.r,Bo.g,Bo.b,b,u)}function x(){E!==void 0&&(E.geometry.dispose(),E.material.dispose(),E=void 0),g!==void 0&&(g.geometry.dispose(),g.material.dispose(),g=void 0)}return{getClearColor:function(){return d},setClearColor:function(R,b=1){d.set(R),p=b,m(d,p)},getClearAlpha:function(){return p},setClearAlpha:function(R){p=R,m(d,p)},render:w,addToRenderList:T,dispose:x}}function JE(t,i){const a=t.getParameter(t.MAX_VERTEX_ATTRIBS),r={},o=v(null);let c=o,u=!1;function d(M,L,F,W,Q){let te=!1;const G=_(W,F,L);c!==G&&(c=G,g(c.object)),te=S(M,W,F,Q),te&&U(M,W,F,Q),Q!==null&&i.update(Q,t.ELEMENT_ARRAY_BUFFER),(te||u)&&(u=!1,b(M,L,F,W),Q!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,i.get(Q).buffer))}function p(){return t.createVertexArray()}function g(M){return t.bindVertexArray(M)}function E(M){return t.deleteVertexArray(M)}function _(M,L,F){const W=F.wireframe===!0;let Q=r[M.id];Q===void 0&&(Q={},r[M.id]=Q);let te=Q[L.id];te===void 0&&(te={},Q[L.id]=te);let G=te[W];return G===void 0&&(G=v(p()),te[W]=G),G}function v(M){const L=[],F=[],W=[];for(let Q=0;Q<a;Q++)L[Q]=0,F[Q]=0,W[Q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:F,attributeDivisors:W,object:M,attributes:{},index:null}}function S(M,L,F,W){const Q=c.attributes,te=L.attributes;let G=0;const ne=F.getAttributes();for(const K in ne)if(ne[K].location>=0){const xe=Q[K];let Qe=te[K];if(Qe===void 0&&(K==="instanceMatrix"&&M.instanceMatrix&&(Qe=M.instanceMatrix),K==="instanceColor"&&M.instanceColor&&(Qe=M.instanceColor)),xe===void 0||xe.attribute!==Qe||Qe&&xe.data!==Qe.data)return!0;G++}return c.attributesNum!==G||c.index!==W}function U(M,L,F,W){const Q={},te=L.attributes;let G=0;const ne=F.getAttributes();for(const K in ne)if(ne[K].location>=0){let xe=te[K];xe===void 0&&(K==="instanceMatrix"&&M.instanceMatrix&&(xe=M.instanceMatrix),K==="instanceColor"&&M.instanceColor&&(xe=M.instanceColor));const Qe={};Qe.attribute=xe,xe&&xe.data&&(Qe.data=xe.data),Q[K]=Qe,G++}c.attributes=Q,c.attributesNum=G,c.index=W}function w(){const M=c.newAttributes;for(let L=0,F=M.length;L<F;L++)M[L]=0}function T(M){m(M,0)}function m(M,L){const F=c.newAttributes,W=c.enabledAttributes,Q=c.attributeDivisors;F[M]=1,W[M]===0&&(t.enableVertexAttribArray(M),W[M]=1),Q[M]!==L&&(t.vertexAttribDivisor(M,L),Q[M]=L)}function x(){const M=c.newAttributes,L=c.enabledAttributes;for(let F=0,W=L.length;F<W;F++)L[F]!==M[F]&&(t.disableVertexAttribArray(F),L[F]=0)}function R(M,L,F,W,Q,te,G){G===!0?t.vertexAttribIPointer(M,L,F,Q,te):t.vertexAttribPointer(M,L,F,W,Q,te)}function b(M,L,F,W){w();const Q=W.attributes,te=F.getAttributes(),G=L.defaultAttributeValues;for(const ne in te){const K=te[ne];if(K.location>=0){let de=Q[ne];if(de===void 0&&(ne==="instanceMatrix"&&M.instanceMatrix&&(de=M.instanceMatrix),ne==="instanceColor"&&M.instanceColor&&(de=M.instanceColor)),de!==void 0){const xe=de.normalized,Qe=de.itemSize,ot=i.get(de);if(ot===void 0)continue;const Ut=ot.buffer,mt=ot.type,lt=ot.bytesPerElement,oe=mt===t.INT||mt===t.UNSIGNED_INT||de.gpuType===tm;if(de.isInterleavedBufferAttribute){const ue=de.data,Ue=ue.stride,Ze=de.offset;if(ue.isInstancedInterleavedBuffer){for(let He=0;He<K.locationSize;He++)m(K.location+He,ue.meshPerAttribute);M.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let He=0;He<K.locationSize;He++)T(K.location+He);t.bindBuffer(t.ARRAY_BUFFER,Ut);for(let He=0;He<K.locationSize;He++)R(K.location+He,Qe/K.locationSize,mt,xe,Ue*lt,(Ze+Qe/K.locationSize*He)*lt,oe)}else{if(de.isInstancedBufferAttribute){for(let ue=0;ue<K.locationSize;ue++)m(K.location+ue,de.meshPerAttribute);M.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let ue=0;ue<K.locationSize;ue++)T(K.location+ue);t.bindBuffer(t.ARRAY_BUFFER,Ut);for(let ue=0;ue<K.locationSize;ue++)R(K.location+ue,Qe/K.locationSize,mt,xe,Qe*lt,Qe/K.locationSize*ue*lt,oe)}}else if(G!==void 0){const xe=G[ne];if(xe!==void 0)switch(xe.length){case 2:t.vertexAttrib2fv(K.location,xe);break;case 3:t.vertexAttrib3fv(K.location,xe);break;case 4:t.vertexAttrib4fv(K.location,xe);break;default:t.vertexAttrib1fv(K.location,xe)}}}}x()}function P(){I();for(const M in r){const L=r[M];for(const F in L){const W=L[F];for(const Q in W)E(W[Q].object),delete W[Q];delete L[F]}delete r[M]}}function N(M){if(r[M.id]===void 0)return;const L=r[M.id];for(const F in L){const W=L[F];for(const Q in W)E(W[Q].object),delete W[Q];delete L[F]}delete r[M.id]}function O(M){for(const L in r){const F=r[L];if(F[M.id]===void 0)continue;const W=F[M.id];for(const Q in W)E(W[Q].object),delete W[Q];delete F[M.id]}}function I(){y(),u=!0,c!==o&&(c=o,g(c.object))}function y(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:d,reset:I,resetDefaultState:y,dispose:P,releaseStatesOfGeometry:N,releaseStatesOfProgram:O,initAttributes:w,enableAttribute:T,disableUnusedAttributes:x}}function $E(t,i,a){let r;function o(g){r=g}function c(g,E){t.drawArrays(r,g,E),a.update(E,r,1)}function u(g,E,_){_!==0&&(t.drawArraysInstanced(r,g,E,_),a.update(E,r,_))}function d(g,E,_){if(_===0)return;i.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,g,0,E,0,_);let S=0;for(let U=0;U<_;U++)S+=E[U];a.update(S,r,1)}function p(g,E,_,v){if(_===0)return;const S=i.get("WEBGL_multi_draw");if(S===null)for(let U=0;U<g.length;U++)u(g[U],E[U],v[U]);else{S.multiDrawArraysInstancedWEBGL(r,g,0,E,0,v,0,_);let U=0;for(let w=0;w<_;w++)U+=E[w]*v[w];a.update(U,r,1)}}this.setMode=o,this.render=c,this.renderInstances=u,this.renderMultiDraw=d,this.renderMultiDrawInstances=p}function eT(t,i,a,r){let o;function c(){if(o!==void 0)return o;if(i.has("EXT_texture_filter_anisotropic")===!0){const O=i.get("EXT_texture_filter_anisotropic");o=t.getParameter(O.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function u(O){return!(O!==bn&&r.convert(O)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(O){const I=O===Kr&&(i.has("EXT_color_buffer_half_float")||i.has("EXT_color_buffer_float"));return!(O!==Cn&&r.convert(O)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&O!==_i&&!I)}function p(O){if(O==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";O="mediump"}return O==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let g=a.precision!==void 0?a.precision:"highp";const E=p(g);E!==g&&(console.warn("THREE.WebGLRenderer:",g,"not supported, using",E,"instead."),g=E);const _=a.logarithmicDepthBuffer===!0,v=a.reversedDepthBuffer===!0&&i.has("EXT_clip_control"),S=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),U=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=t.getParameter(t.MAX_TEXTURE_SIZE),T=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),m=t.getParameter(t.MAX_VERTEX_ATTRIBS),x=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),R=t.getParameter(t.MAX_VARYING_VECTORS),b=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),P=U>0,N=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:c,getMaxPrecision:p,textureFormatReadable:u,textureTypeReadable:d,precision:g,logarithmicDepthBuffer:_,reversedDepthBuffer:v,maxTextures:S,maxVertexTextures:U,maxTextureSize:w,maxCubemapSize:T,maxAttributes:m,maxVertexUniforms:x,maxVaryings:R,maxFragmentUniforms:b,vertexTextures:P,maxSamples:N}}function tT(t){const i=this;let a=null,r=0,o=!1,c=!1;const u=new Wu,d=new xt,p={value:null,needsUpdate:!1};this.uniform=p,this.numPlanes=0,this.numIntersection=0,this.init=function(_,v){const S=_.length!==0||v||r!==0||o;return o=v,r=_.length,S},this.beginShadows=function(){c=!0,E(null)},this.endShadows=function(){c=!1},this.setGlobalState=function(_,v){a=E(_,v,0)},this.setState=function(_,v,S){const U=_.clippingPlanes,w=_.clipIntersection,T=_.clipShadows,m=t.get(_);if(!o||U===null||U.length===0||c&&!T)c?E(null):g();else{const x=c?0:r,R=x*4;let b=m.clippingState||null;p.value=b,b=E(U,v,R,S);for(let P=0;P!==R;++P)b[P]=a[P];m.clippingState=b,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=x}};function g(){p.value!==a&&(p.value=a,p.needsUpdate=r>0),i.numPlanes=r,i.numIntersection=0}function E(_,v,S,U){const w=_!==null?_.length:0;let T=null;if(w!==0){if(T=p.value,U!==!0||T===null){const m=S+w*4,x=v.matrixWorldInverse;d.getNormalMatrix(x),(T===null||T.length<m)&&(T=new Float32Array(m));for(let R=0,b=S;R!==w;++R,b+=4)u.copy(_[R]).applyMatrix4(x,d),u.normal.toArray(T,b),T[b+3]=u.constant}p.value=T,p.needsUpdate=!0}return i.numPlanes=w,i.numIntersection=0,T}}function nT(t){let i=new WeakMap;function a(u,d){return d===ul?u.mapping=Yr:d===Au&&(u.mapping=Qs),u}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===ul||d===Au)if(i.has(u)){const p=i.get(u).texture;return a(p,u.mapping)}else{const p=u.image;if(p&&p.height>0){const g=new R_(p.height);return g.fromEquirectangularTexture(t,u),i.set(u,g),u.addEventListener("dispose",o),a(g.texture,u.mapping)}else return null}}return u}function o(u){const d=u.target;d.removeEventListener("dispose",o);const p=i.get(d);p!==void 0&&(i.delete(d),p.dispose())}function c(){i=new WeakMap}return{get:r,dispose:c}}const Vs=4,Yp=[.125,.215,.35,.446,.526,.582],is=20,Yc=new ku,Kp=new at;let Kc=null,Qc=0,Zc=0,jc=!1;const ns=(1+Math.sqrt(5))/2,ws=1/ns,Qp=[new le(-ns,ws,0),new le(ns,ws,0),new le(-ws,0,ns),new le(ws,0,ns),new le(0,ns,-ws),new le(0,ns,ws),new le(-1,1,-1),new le(1,1,-1),new le(-1,1,1),new le(1,1,1)],iT=new le;class Zp{constructor(i){this._renderer=i,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(i,a=0,r=.1,o=100,c={}){const{size:u=256,position:d=iT}=c;Kc=this._renderer.getRenderTarget(),Qc=this._renderer.getActiveCubeFace(),Zc=this._renderer.getActiveMipmapLevel(),jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(u);const p=this._allocateTargets();return p.depthBuffer=!0,this._sceneToCubeUV(i,r,o,p,d),a>0&&this._blur(p,0,0,a),this._applyPMREM(p),this._cleanup(p),p}fromEquirectangular(i,a=null){return this._fromTexture(i,a)}fromCubemap(i,a=null){return this._fromTexture(i,a)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$p(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Jp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(i){this._lodMax=Math.floor(Math.log2(i)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let i=0;i<this._lodPlanes.length;i++)this._lodPlanes[i].dispose()}_cleanup(i){this._renderer.setRenderTarget(Kc,Qc,Zc),this._renderer.xr.enabled=jc,i.scissorTest=!1,Oo(i,0,0,i.width,i.height)}_fromTexture(i,a){i.mapping===Yr||i.mapping===Qs?this._setSize(i.image.length===0?16:i.image[0].width||i.image[0].image.width):this._setSize(i.image.width/4),Kc=this._renderer.getRenderTarget(),Qc=this._renderer.getActiveCubeFace(),Zc=this._renderer.getActiveMipmapLevel(),jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=a||this._allocateTargets();return this._textureToCubeUV(i,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const i=3*Math.max(this._cubeSize,112),a=4*this._cubeSize,r={magFilter:Hi,minFilter:Hi,generateMipmaps:!1,type:Kr,format:bn,colorSpace:js,depthBuffer:!1},o=jp(i,a,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==i||this._pingPongRenderTarget.height!==a){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=jp(i,a,r);const{_lodMax:c}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=aT(c)),this._blurMaterial=sT(c,i,a)}return o}_compileMaterial(i){const a=new gi(this._lodPlanes[0],i);this._renderer.compile(a,Yc)}_sceneToCubeUV(i,a,r,o,c){const p=new Ws(90,1,a,r),g=[1,-1,1,1,1,1],E=[1,1,1,-1,-1,-1],_=this._renderer,v=_.autoClear,S=_.toneMapping;_.getClearColor(Kp),_.toneMapping=sa,_.autoClear=!1,_.state.buffers.depth.getReversed()&&(_.setRenderTarget(o),_.clearDepth(),_.setRenderTarget(null));const w=new fm({name:"PMREM.Background",side:gn,depthWrite:!1,depthTest:!1}),T=new gi(new lm,w);let m=!1;const x=i.background;x?x.isColor&&(w.color.copy(x),i.background=null,m=!0):(w.color.copy(Kp),m=!0);for(let R=0;R<6;R++){const b=R%3;b===0?(p.up.set(0,g[R],0),p.position.set(c.x,c.y,c.z),p.lookAt(c.x+E[R],c.y,c.z)):b===1?(p.up.set(0,0,g[R]),p.position.set(c.x,c.y,c.z),p.lookAt(c.x,c.y+E[R],c.z)):(p.up.set(0,g[R],0),p.position.set(c.x,c.y,c.z),p.lookAt(c.x,c.y,c.z+E[R]));const P=this._cubeSize;Oo(o,b*P,R>2?P:0,P,P),_.setRenderTarget(o),m&&_.render(T,p),_.render(i,p)}T.geometry.dispose(),T.material.dispose(),_.toneMapping=S,_.autoClear=v,i.background=x}_textureToCubeUV(i,a){const r=this._renderer,o=i.mapping===Yr||i.mapping===Qs;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=$p()),this._cubemapMaterial.uniforms.flipEnvMap.value=i.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Jp());const c=o?this._cubemapMaterial:this._equirectMaterial,u=new gi(this._lodPlanes[0],c),d=c.uniforms;d.envMap.value=i;const p=this._cubeSize;Oo(a,0,0,3*p,2*p),r.setRenderTarget(a),r.render(u,Yc)}_applyPMREM(i){const a=this._renderer,r=a.autoClear;a.autoClear=!1;const o=this._lodPlanes.length;for(let c=1;c<o;c++){const u=Math.sqrt(this._sigmas[c]*this._sigmas[c]-this._sigmas[c-1]*this._sigmas[c-1]),d=Qp[(o-c-1)%Qp.length];this._blur(i,c-1,c,u,d)}a.autoClear=r}_blur(i,a,r,o,c){const u=this._pingPongRenderTarget;this._halfBlur(i,u,a,r,o,"latitudinal",c),this._halfBlur(u,i,r,r,o,"longitudinal",c)}_halfBlur(i,a,r,o,c,u,d){const p=this._renderer,g=this._blurMaterial;u!=="latitudinal"&&u!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const E=3,_=new gi(this._lodPlanes[o],g),v=g.uniforms,S=this._sizeLods[r]-1,U=isFinite(c)?Math.PI/(2*S):2*Math.PI/(2*is-1),w=c/U,T=isFinite(c)?1+Math.floor(E*w):is;T>is&&console.warn(`sigmaRadians, ${c}, is too large and will clip, as it requested ${T} samples when the maximum is set to ${is}`);const m=[];let x=0;for(let O=0;O<is;++O){const I=O/w,y=Math.exp(-I*I/2);m.push(y),O===0?x+=y:O<T&&(x+=2*y)}for(let O=0;O<m.length;O++)m[O]=m[O]/x;v.envMap.value=i.texture,v.samples.value=T,v.weights.value=m,v.latitudinal.value=u==="latitudinal",d&&(v.poleAxis.value=d);const{_lodMax:R}=this;v.dTheta.value=U,v.mipInt.value=R-r;const b=this._sizeLods[o],P=3*b*(o>R-Vs?o-R+Vs:0),N=4*(this._cubeSize-b);Oo(a,P,N,3*b,2*b),p.setRenderTarget(a),p.render(_,Yc)}}function aT(t){const i=[],a=[],r=[];let o=t;const c=t-Vs+1+Yp.length;for(let u=0;u<c;u++){const d=Math.pow(2,o);a.push(d);let p=1/d;u>t-Vs?p=Yp[u-t+Vs-1]:u===0&&(p=0),r.push(p);const g=1/(d-2),E=-g,_=1+g,v=[E,E,_,E,_,_,E,E,_,_,E,_],S=6,U=6,w=3,T=2,m=1,x=new Float32Array(w*U*S),R=new Float32Array(T*U*S),b=new Float32Array(m*U*S);for(let N=0;N<S;N++){const O=N%3*2/3-1,I=N>2?0:-1,y=[O,I,0,O+2/3,I,0,O+2/3,I+1,0,O,I,0,O+2/3,I+1,0,O,I+1,0];x.set(y,w*U*N),R.set(v,T*U*N);const M=[N,N,N,N,N,N];b.set(M,m*U*N)}const P=new as;P.setAttribute("position",new ii(x,w)),P.setAttribute("uv",new ii(R,T)),P.setAttribute("faceIndex",new ii(b,m)),i.push(P),o>Vs&&o--}return{lodPlanes:i,sizeLods:a,sigmas:r}}function jp(t,i,a){const r=new $t(t,i,a);return r.texture.mapping=hl,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function Oo(t,i,a,r,o){t.viewport.set(i,a,r,o),t.scissor.set(i,a,r,o)}function sT(t,i,a){const r=new Float32Array(is),o=new le(0,1,0);return new rn({name:"SphericalGaussianBlur",defines:{n:is,CUBEUV_TEXEL_WIDTH:1/i,CUBEUV_TEXEL_HEIGHT:1/a,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:Ku(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Jp(){return new rn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ku(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function $p(){return new rn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ku(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Ku(){return`

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
	`}function rT(t){let i=new WeakMap,a=null;function r(d){if(d&&d.isTexture){const p=d.mapping,g=p===ul||p===Au,E=p===Yr||p===Qs;if(g||E){let _=i.get(d);const v=_!==void 0?_.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==v)return a===null&&(a=new Zp(t)),_=g?a.fromEquirectangular(d,_):a.fromCubemap(d,_),_.texture.pmremVersion=d.pmremVersion,i.set(d,_),_.texture;if(_!==void 0)return _.texture;{const S=d.image;return g&&S&&S.height>0||E&&S&&o(S)?(a===null&&(a=new Zp(t)),_=g?a.fromEquirectangular(d):a.fromCubemap(d),_.texture.pmremVersion=d.pmremVersion,i.set(d,_),d.addEventListener("dispose",c),_.texture):null}}}return d}function o(d){let p=0;const g=6;for(let E=0;E<g;E++)d[E]!==void 0&&p++;return p===g}function c(d){const p=d.target;p.removeEventListener("dispose",c);const g=i.get(p);g!==void 0&&(i.delete(p),g.dispose())}function u(){i=new WeakMap,a!==null&&(a.dispose(),a=null)}return{get:r,dispose:u}}function oT(t){const i={};function a(r){if(i[r]!==void 0)return i[r];let o;switch(r){case"WEBGL_depth_texture":o=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":o=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":o=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":o=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:o=t.getExtension(r)}return i[r]=o,o}return{has:function(r){return a(r)!==null},init:function(){a("EXT_color_buffer_float"),a("WEBGL_clip_cull_distance"),a("OES_texture_float_linear"),a("EXT_color_buffer_half_float"),a("WEBGL_multisampled_render_to_texture"),a("WEBGL_render_shared_exponent")},get:function(r){const o=a(r);return o===null&&_u("THREE.WebGLRenderer: "+r+" extension not supported."),o}}}function lT(t,i,a,r){const o={},c=new WeakMap;function u(_){const v=_.target;v.index!==null&&i.remove(v.index);for(const U in v.attributes)i.remove(v.attributes[U]);v.removeEventListener("dispose",u),delete o[v.id];const S=c.get(v);S&&(i.remove(S),c.delete(v)),r.releaseStatesOfGeometry(v),v.isInstancedBufferGeometry===!0&&delete v._maxInstanceCount,a.memory.geometries--}function d(_,v){return o[v.id]===!0||(v.addEventListener("dispose",u),o[v.id]=!0,a.memory.geometries++),v}function p(_){const v=_.attributes;for(const S in v)i.update(v[S],t.ARRAY_BUFFER)}function g(_){const v=[],S=_.index,U=_.attributes.position;let w=0;if(S!==null){const x=S.array;w=S.version;for(let R=0,b=x.length;R<b;R+=3){const P=x[R+0],N=x[R+1],O=x[R+2];v.push(P,N,N,O,O,P)}}else if(U!==void 0){const x=U.array;w=U.version;for(let R=0,b=x.length/3-1;R<b;R+=3){const P=R+0,N=R+1,O=R+2;v.push(P,N,N,O,O,P)}}else return;const T=new(P_(v)?D_:w_)(v,1);T.version=w;const m=c.get(_);m&&i.remove(m),c.set(_,T)}function E(_){const v=c.get(_);if(v){const S=_.index;S!==null&&v.version<S.version&&g(_)}else g(_);return c.get(_)}return{get:d,update:p,getWireframeAttribute:E}}function cT(t,i,a){let r;function o(v){r=v}let c,u;function d(v){c=v.type,u=v.bytesPerElement}function p(v,S){t.drawElements(r,S,c,v*u),a.update(S,r,1)}function g(v,S,U){U!==0&&(t.drawElementsInstanced(r,S,c,v*u,U),a.update(S,r,U))}function E(v,S,U){if(U===0)return;i.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,S,0,c,v,0,U);let T=0;for(let m=0;m<U;m++)T+=S[m];a.update(T,r,1)}function _(v,S,U,w){if(U===0)return;const T=i.get("WEBGL_multi_draw");if(T===null)for(let m=0;m<v.length;m++)g(v[m]/u,S[m],w[m]);else{T.multiDrawElementsInstancedWEBGL(r,S,0,c,v,0,w,0,U);let m=0;for(let x=0;x<U;x++)m+=S[x]*w[x];a.update(m,r,1)}}this.setMode=o,this.setIndex=d,this.render=p,this.renderInstances=g,this.renderMultiDraw=E,this.renderMultiDrawInstances=_}function uT(t){const i={geometries:0,textures:0},a={frame:0,calls:0,triangles:0,points:0,lines:0};function r(c,u,d){switch(a.calls++,u){case t.TRIANGLES:a.triangles+=d*(c/3);break;case t.LINES:a.lines+=d*(c/2);break;case t.LINE_STRIP:a.lines+=d*(c-1);break;case t.LINE_LOOP:a.lines+=d*c;break;case t.POINTS:a.points+=d*c;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",u);break}}function o(){a.calls=0,a.triangles=0,a.points=0,a.lines=0}return{memory:i,render:a,programs:null,autoReset:!0,reset:o,update:r}}function fT(t,i,a){const r=new WeakMap,o=new An;function c(u,d,p){const g=u.morphTargetInfluences,E=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,_=E!==void 0?E.length:0;let v=r.get(d);if(v===void 0||v.count!==_){let y=function(){O.dispose(),r.delete(d),d.removeEventListener("dispose",y)};v!==void 0&&v.texture.dispose();const S=d.morphAttributes.position!==void 0,U=d.morphAttributes.normal!==void 0,w=d.morphAttributes.color!==void 0,T=d.morphAttributes.position||[],m=d.morphAttributes.normal||[],x=d.morphAttributes.color||[];let R=0;S===!0&&(R=1),U===!0&&(R=2),w===!0&&(R=3);let b=d.attributes.position.count*R,P=1;b>i.maxTextureSize&&(P=Math.ceil(b/i.maxTextureSize),b=i.maxTextureSize);const N=new Float32Array(b*P*4*_),O=new rm(N,b,P,_);O.type=_i,O.needsUpdate=!0;const I=R*4;for(let M=0;M<_;M++){const L=T[M],F=m[M],W=x[M],Q=b*P*4*M;for(let te=0;te<L.count;te++){const G=te*I;S===!0&&(o.fromBufferAttribute(L,te),N[Q+G+0]=o.x,N[Q+G+1]=o.y,N[Q+G+2]=o.z,N[Q+G+3]=0),U===!0&&(o.fromBufferAttribute(F,te),N[Q+G+4]=o.x,N[Q+G+5]=o.y,N[Q+G+6]=o.z,N[Q+G+7]=0),w===!0&&(o.fromBufferAttribute(W,te),N[Q+G+8]=o.x,N[Q+G+9]=o.y,N[Q+G+10]=o.z,N[Q+G+11]=W.itemSize===4?o.w:1)}}v={count:_,texture:O,size:new Ye(b,P)},r.set(d,v),d.addEventListener("dispose",y)}if(u.isInstancedMesh===!0&&u.morphTexture!==null)p.getUniforms().setValue(t,"morphTexture",u.morphTexture,a);else{let S=0;for(let w=0;w<g.length;w++)S+=g[w];const U=d.morphTargetsRelative?1:1-S;p.getUniforms().setValue(t,"morphTargetBaseInfluence",U),p.getUniforms().setValue(t,"morphTargetInfluences",g)}p.getUniforms().setValue(t,"morphTargetsTexture",v.texture,a),p.getUniforms().setValue(t,"morphTargetsTextureSize",v.size)}return{update:c}}function dT(t,i,a,r){let o=new WeakMap;function c(p){const g=r.render.frame,E=p.geometry,_=i.get(p,E);if(o.get(_)!==g&&(i.update(_),o.set(_,g)),p.isInstancedMesh&&(p.hasEventListener("dispose",d)===!1&&p.addEventListener("dispose",d),o.get(p)!==g&&(a.update(p.instanceMatrix,t.ARRAY_BUFFER),p.instanceColor!==null&&a.update(p.instanceColor,t.ARRAY_BUFFER),o.set(p,g))),p.isSkinnedMesh){const v=p.skeleton;o.get(v)!==g&&(v.update(),o.set(v,g))}return _}function u(){o=new WeakMap}function d(p){const g=p.target;g.removeEventListener("dispose",d),a.remove(g.instanceMatrix),g.instanceColor!==null&&a.remove(g.instanceColor)}return{update:c,dispose:u}}const hm=new Yu,eh=new Xu(1,1),mm=new rm,vm=new X_,gm=new V_,th=[],nh=[],ih=new Float32Array(16),ah=new Float32Array(9),sh=new Float32Array(4);function $s(t,i,a){const r=t[0];if(r<=0||r>0)return t;const o=i*a;let c=th[o];if(c===void 0&&(c=new Float32Array(o),th[o]=c),i!==0){r.toArray(c,0);for(let u=1,d=0;u!==i;++u)d+=a,t[u].toArray(c,d)}return c}function on(t,i){if(t.length!==i.length)return!1;for(let a=0,r=t.length;a<r;a++)if(t[a]!==i[a])return!1;return!0}function ln(t,i){for(let a=0,r=i.length;a<r;a++)t[a]=i[a]}function ml(t,i){let a=nh[i];a===void 0&&(a=new Int32Array(i),nh[i]=a);for(let r=0;r!==i;++r)a[r]=t.allocateTextureUnit();return a}function pT(t,i){const a=this.cache;a[0]!==i&&(t.uniform1f(this.addr,i),a[0]=i)}function hT(t,i){const a=this.cache;if(i.x!==void 0)(a[0]!==i.x||a[1]!==i.y)&&(t.uniform2f(this.addr,i.x,i.y),a[0]=i.x,a[1]=i.y);else{if(on(a,i))return;t.uniform2fv(this.addr,i),ln(a,i)}}function mT(t,i){const a=this.cache;if(i.x!==void 0)(a[0]!==i.x||a[1]!==i.y||a[2]!==i.z)&&(t.uniform3f(this.addr,i.x,i.y,i.z),a[0]=i.x,a[1]=i.y,a[2]=i.z);else if(i.r!==void 0)(a[0]!==i.r||a[1]!==i.g||a[2]!==i.b)&&(t.uniform3f(this.addr,i.r,i.g,i.b),a[0]=i.r,a[1]=i.g,a[2]=i.b);else{if(on(a,i))return;t.uniform3fv(this.addr,i),ln(a,i)}}function vT(t,i){const a=this.cache;if(i.x!==void 0)(a[0]!==i.x||a[1]!==i.y||a[2]!==i.z||a[3]!==i.w)&&(t.uniform4f(this.addr,i.x,i.y,i.z,i.w),a[0]=i.x,a[1]=i.y,a[2]=i.z,a[3]=i.w);else{if(on(a,i))return;t.uniform4fv(this.addr,i),ln(a,i)}}function gT(t,i){const a=this.cache,r=i.elements;if(r===void 0){if(on(a,i))return;t.uniformMatrix2fv(this.addr,!1,i),ln(a,i)}else{if(on(a,r))return;sh.set(r),t.uniformMatrix2fv(this.addr,!1,sh),ln(a,r)}}function _T(t,i){const a=this.cache,r=i.elements;if(r===void 0){if(on(a,i))return;t.uniformMatrix3fv(this.addr,!1,i),ln(a,i)}else{if(on(a,r))return;ah.set(r),t.uniformMatrix3fv(this.addr,!1,ah),ln(a,r)}}function ST(t,i){const a=this.cache,r=i.elements;if(r===void 0){if(on(a,i))return;t.uniformMatrix4fv(this.addr,!1,i),ln(a,i)}else{if(on(a,r))return;ih.set(r),t.uniformMatrix4fv(this.addr,!1,ih),ln(a,r)}}function ET(t,i){const a=this.cache;a[0]!==i&&(t.uniform1i(this.addr,i),a[0]=i)}function TT(t,i){const a=this.cache;if(i.x!==void 0)(a[0]!==i.x||a[1]!==i.y)&&(t.uniform2i(this.addr,i.x,i.y),a[0]=i.x,a[1]=i.y);else{if(on(a,i))return;t.uniform2iv(this.addr,i),ln(a,i)}}function MT(t,i){const a=this.cache;if(i.x!==void 0)(a[0]!==i.x||a[1]!==i.y||a[2]!==i.z)&&(t.uniform3i(this.addr,i.x,i.y,i.z),a[0]=i.x,a[1]=i.y,a[2]=i.z);else{if(on(a,i))return;t.uniform3iv(this.addr,i),ln(a,i)}}function yT(t,i){const a=this.cache;if(i.x!==void 0)(a[0]!==i.x||a[1]!==i.y||a[2]!==i.z||a[3]!==i.w)&&(t.uniform4i(this.addr,i.x,i.y,i.z,i.w),a[0]=i.x,a[1]=i.y,a[2]=i.z,a[3]=i.w);else{if(on(a,i))return;t.uniform4iv(this.addr,i),ln(a,i)}}function xT(t,i){const a=this.cache;a[0]!==i&&(t.uniform1ui(this.addr,i),a[0]=i)}function AT(t,i){const a=this.cache;if(i.x!==void 0)(a[0]!==i.x||a[1]!==i.y)&&(t.uniform2ui(this.addr,i.x,i.y),a[0]=i.x,a[1]=i.y);else{if(on(a,i))return;t.uniform2uiv(this.addr,i),ln(a,i)}}function RT(t,i){const a=this.cache;if(i.x!==void 0)(a[0]!==i.x||a[1]!==i.y||a[2]!==i.z)&&(t.uniform3ui(this.addr,i.x,i.y,i.z),a[0]=i.x,a[1]=i.y,a[2]=i.z);else{if(on(a,i))return;t.uniform3uiv(this.addr,i),ln(a,i)}}function bT(t,i){const a=this.cache;if(i.x!==void 0)(a[0]!==i.x||a[1]!==i.y||a[2]!==i.z||a[3]!==i.w)&&(t.uniform4ui(this.addr,i.x,i.y,i.z,i.w),a[0]=i.x,a[1]=i.y,a[2]=i.z,a[3]=i.w);else{if(on(a,i))return;t.uniform4uiv(this.addr,i),ln(a,i)}}function UT(t,i,a){const r=this.cache,o=a.allocateTextureUnit();r[0]!==o&&(t.uniform1i(this.addr,o),r[0]=o);let c;this.type===t.SAMPLER_2D_SHADOW?(eh.compareFunction=Zh,c=eh):c=hm,a.setTexture2D(i||c,o)}function CT(t,i,a){const r=this.cache,o=a.allocateTextureUnit();r[0]!==o&&(t.uniform1i(this.addr,o),r[0]=o),a.setTexture3D(i||vm,o)}function DT(t,i,a){const r=this.cache,o=a.allocateTextureUnit();r[0]!==o&&(t.uniform1i(this.addr,o),r[0]=o),a.setTextureCube(i||gm,o)}function wT(t,i,a){const r=this.cache,o=a.allocateTextureUnit();r[0]!==o&&(t.uniform1i(this.addr,o),r[0]=o),a.setTexture2DArray(i||mm,o)}function PT(t){switch(t){case 5126:return pT;case 35664:return hT;case 35665:return mT;case 35666:return vT;case 35674:return gT;case 35675:return _T;case 35676:return ST;case 5124:case 35670:return ET;case 35667:case 35671:return TT;case 35668:case 35672:return MT;case 35669:case 35673:return yT;case 5125:return xT;case 36294:return AT;case 36295:return RT;case 36296:return bT;case 35678:case 36198:case 36298:case 36306:case 35682:return UT;case 35679:case 36299:case 36307:return CT;case 35680:case 36300:case 36308:case 36293:return DT;case 36289:case 36303:case 36311:case 36292:return wT}}function NT(t,i){t.uniform1fv(this.addr,i)}function LT(t,i){const a=$s(i,this.size,2);t.uniform2fv(this.addr,a)}function BT(t,i){const a=$s(i,this.size,3);t.uniform3fv(this.addr,a)}function OT(t,i){const a=$s(i,this.size,4);t.uniform4fv(this.addr,a)}function IT(t,i){const a=$s(i,this.size,4);t.uniformMatrix2fv(this.addr,!1,a)}function FT(t,i){const a=$s(i,this.size,9);t.uniformMatrix3fv(this.addr,!1,a)}function HT(t,i){const a=$s(i,this.size,16);t.uniformMatrix4fv(this.addr,!1,a)}function zT(t,i){t.uniform1iv(this.addr,i)}function GT(t,i){t.uniform2iv(this.addr,i)}function VT(t,i){t.uniform3iv(this.addr,i)}function XT(t,i){t.uniform4iv(this.addr,i)}function WT(t,i){t.uniform1uiv(this.addr,i)}function qT(t,i){t.uniform2uiv(this.addr,i)}function kT(t,i){t.uniform3uiv(this.addr,i)}function YT(t,i){t.uniform4uiv(this.addr,i)}function KT(t,i,a){const r=this.cache,o=i.length,c=ml(a,o);on(r,c)||(t.uniform1iv(this.addr,c),ln(r,c));for(let u=0;u!==o;++u)a.setTexture2D(i[u]||hm,c[u])}function QT(t,i,a){const r=this.cache,o=i.length,c=ml(a,o);on(r,c)||(t.uniform1iv(this.addr,c),ln(r,c));for(let u=0;u!==o;++u)a.setTexture3D(i[u]||vm,c[u])}function ZT(t,i,a){const r=this.cache,o=i.length,c=ml(a,o);on(r,c)||(t.uniform1iv(this.addr,c),ln(r,c));for(let u=0;u!==o;++u)a.setTextureCube(i[u]||gm,c[u])}function jT(t,i,a){const r=this.cache,o=i.length,c=ml(a,o);on(r,c)||(t.uniform1iv(this.addr,c),ln(r,c));for(let u=0;u!==o;++u)a.setTexture2DArray(i[u]||mm,c[u])}function JT(t){switch(t){case 5126:return NT;case 35664:return LT;case 35665:return BT;case 35666:return OT;case 35674:return IT;case 35675:return FT;case 35676:return HT;case 5124:case 35670:return zT;case 35667:case 35671:return GT;case 35668:case 35672:return VT;case 35669:case 35673:return XT;case 5125:return WT;case 36294:return qT;case 36295:return kT;case 36296:return YT;case 35678:case 36198:case 36298:case 36306:case 35682:return KT;case 35679:case 36299:case 36307:return QT;case 35680:case 36300:case 36308:case 36293:return ZT;case 36289:case 36303:case 36311:case 36292:return jT}}class $T{constructor(i,a,r){this.id=i,this.addr=r,this.cache=[],this.type=a.type,this.setValue=PT(a.type)}}class eM{constructor(i,a,r){this.id=i,this.addr=r,this.cache=[],this.type=a.type,this.size=a.size,this.setValue=JT(a.type)}}class tM{constructor(i){this.id=i,this.seq=[],this.map={}}setValue(i,a,r){const o=this.seq;for(let c=0,u=o.length;c!==u;++c){const d=o[c];d.setValue(i,a[d.id],r)}}}const Jc=/(\w+)(\])?(\[|\.)?/g;function rh(t,i){t.seq.push(i),t.map[i.id]=i}function nM(t,i,a){const r=t.name,o=r.length;for(Jc.lastIndex=0;;){const c=Jc.exec(r),u=Jc.lastIndex;let d=c[1];const p=c[2]==="]",g=c[3];if(p&&(d=d|0),g===void 0||g==="["&&u+2===o){rh(a,g===void 0?new $T(d,t,i):new eM(d,t,i));break}else{let _=a.map[d];_===void 0&&(_=new tM(d),rh(a,_)),a=_}}}class il{constructor(i,a){this.seq=[],this.map={};const r=i.getProgramParameter(a,i.ACTIVE_UNIFORMS);for(let o=0;o<r;++o){const c=i.getActiveUniform(a,o),u=i.getUniformLocation(a,c.name);nM(c,u,this)}}setValue(i,a,r,o){const c=this.map[a];c!==void 0&&c.setValue(i,r,o)}setOptional(i,a,r){const o=a[r];o!==void 0&&this.setValue(i,r,o)}static upload(i,a,r,o){for(let c=0,u=a.length;c!==u;++c){const d=a[c],p=r[d.id];p.needsUpdate!==!1&&d.setValue(i,p.value,o)}}static seqWithValue(i,a){const r=[];for(let o=0,c=i.length;o!==c;++o){const u=i[o];u.id in a&&r.push(u)}return r}}function oh(t,i,a){const r=t.createShader(i);return t.shaderSource(r,a),t.compileShader(r),r}const iM=37297;let aM=0;function sM(t,i){const a=t.split(`
`),r=[],o=Math.max(i-6,0),c=Math.min(i+6,a.length);for(let u=o;u<c;u++){const d=u+1;r.push(`${d===i?">":" "} ${d}: ${a[u]}`)}return r.join(`
`)}const lh=new xt;function rM(t){nn._getMatrix(lh,nn.workingColorSpace,t);const i=`mat3( ${lh.elements.map(a=>a.toFixed(4))} )`;switch(nn.getTransfer(t)){case um:return[i,"LinearTransferOETF"];case Vt:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[i,"LinearTransferOETF"]}}function ch(t,i,a){const r=t.getShaderParameter(i,t.COMPILE_STATUS),c=(t.getShaderInfoLog(i)||"").trim();if(r&&c==="")return"";const u=/ERROR: 0:(\d+)/.exec(c);if(u){const d=parseInt(u[1]);return a.toUpperCase()+`

`+c+`

`+sM(t.getShaderSource(i),d)}else return c}function oM(t,i){const a=rM(i);return[`vec4 ${t}( vec4 value ) {`,`	return ${a[1]}( vec4( value.rgb * ${a[0]}, value.a ) );`,"}"].join(`
`)}function lM(t,i){let a;switch(i){case G_:a="Linear";break;case z_:a="Reinhard";break;case H_:a="Cineon";break;case F_:a="ACESFilmic";break;case I_:a="AgX";break;case O_:a="Neutral";break;case B_:a="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",i),a="Linear"}return"vec3 "+t+"( vec3 color ) { return "+a+"ToneMapping( color ); }"}const Io=new le;function cM(){nn.getLuminanceCoefficients(Io);const t=Io.x.toFixed(4),i=Io.y.toFixed(4),a=Io.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${i}, ${a} );`,"	return dot( weights, rgb );","}"].join(`
`)}function uM(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Gr).join(`
`)}function fM(t){const i=[];for(const a in t){const r=t[a];r!==!1&&i.push("#define "+a+" "+r)}return i.join(`
`)}function dM(t,i){const a={},r=t.getProgramParameter(i,t.ACTIVE_ATTRIBUTES);for(let o=0;o<r;o++){const c=t.getActiveAttrib(i,o),u=c.name;let d=1;c.type===t.FLOAT_MAT2&&(d=2),c.type===t.FLOAT_MAT3&&(d=3),c.type===t.FLOAT_MAT4&&(d=4),a[u]={type:c.type,location:t.getAttribLocation(i,u),locationSize:d}}return a}function Gr(t){return t!==""}function uh(t,i){const a=i.numSpotLightShadows+i.numSpotLightMaps-i.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,i.numDirLights).replace(/NUM_SPOT_LIGHTS/g,i.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,i.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,a).replace(/NUM_RECT_AREA_LIGHTS/g,i.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,i.numPointLights).replace(/NUM_HEMI_LIGHTS/g,i.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,i.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,i.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,i.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,i.numPointLightShadows)}function fh(t,i){return t.replace(/NUM_CLIPPING_PLANES/g,i.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,i.numClippingPlanes-i.numClipIntersection)}const pM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Uu(t){return t.replace(pM,mM)}const hM=new Map;function mM(t,i){let a=rt[i];if(a===void 0){const r=hM.get(i);if(r!==void 0)a=rt[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',i,r);else throw new Error("Can not resolve #include <"+i+">")}return Uu(a)}const vM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function dh(t){return t.replace(vM,gM)}function gM(t,i,a,r){let o="";for(let c=parseInt(i);c<parseInt(a);c++)o+=r.replace(/\[\s*i\s*\]/g,"[ "+c+" ]").replace(/UNROLLED_LOOP_INDEX/g,c);return o}function ph(t){let i=`precision ${t.precision} float;
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
	`;return t.precision==="highp"?i+=`
#define HIGH_PRECISION`:t.precision==="mediump"?i+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(i+=`
#define LOW_PRECISION`),i}function _M(t){let i="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===jh?i="SHADOWMAP_TYPE_PCF":t.shadowMapType===L_?i="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===ta&&(i="SHADOWMAP_TYPE_VSM"),i}function SM(t){let i="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case Yr:case Qs:i="ENVMAP_TYPE_CUBE";break;case hl:i="ENVMAP_TYPE_CUBE_UV";break}return i}function EM(t){let i="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Qs:i="ENVMAP_MODE_REFRACTION";break}return i}function TM(t){let i="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case Y_:i="ENVMAP_BLENDING_MULTIPLY";break;case k_:i="ENVMAP_BLENDING_MIX";break;case q_:i="ENVMAP_BLENDING_ADD";break}return i}function MM(t){const i=t.envMapCubeUVHeight;if(i===null)return null;const a=Math.log2(i)-2,r=1/i;return{texelWidth:1/(3*Math.max(Math.pow(2,a),112)),texelHeight:r,maxMip:a}}function yM(t,i,a,r){const o=t.getContext(),c=a.defines;let u=a.vertexShader,d=a.fragmentShader;const p=_M(a),g=SM(a),E=EM(a),_=TM(a),v=MM(a),S=uM(a),U=fM(c),w=o.createProgram();let T,m,x=a.glslVersion?"#version "+a.glslVersion+`
`:"";a.isRawShaderMaterial?(T=["#define SHADER_TYPE "+a.shaderType,"#define SHADER_NAME "+a.shaderName,U].filter(Gr).join(`
`),T.length>0&&(T+=`
`),m=["#define SHADER_TYPE "+a.shaderType,"#define SHADER_NAME "+a.shaderName,U].filter(Gr).join(`
`),m.length>0&&(m+=`
`)):(T=[ph(a),"#define SHADER_TYPE "+a.shaderType,"#define SHADER_NAME "+a.shaderName,U,a.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",a.batching?"#define USE_BATCHING":"",a.batchingColor?"#define USE_BATCHING_COLOR":"",a.instancing?"#define USE_INSTANCING":"",a.instancingColor?"#define USE_INSTANCING_COLOR":"",a.instancingMorph?"#define USE_INSTANCING_MORPH":"",a.useFog&&a.fog?"#define USE_FOG":"",a.useFog&&a.fogExp2?"#define FOG_EXP2":"",a.map?"#define USE_MAP":"",a.envMap?"#define USE_ENVMAP":"",a.envMap?"#define "+E:"",a.lightMap?"#define USE_LIGHTMAP":"",a.aoMap?"#define USE_AOMAP":"",a.bumpMap?"#define USE_BUMPMAP":"",a.normalMap?"#define USE_NORMALMAP":"",a.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",a.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",a.displacementMap?"#define USE_DISPLACEMENTMAP":"",a.emissiveMap?"#define USE_EMISSIVEMAP":"",a.anisotropy?"#define USE_ANISOTROPY":"",a.anisotropyMap?"#define USE_ANISOTROPYMAP":"",a.clearcoatMap?"#define USE_CLEARCOATMAP":"",a.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",a.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",a.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",a.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",a.specularMap?"#define USE_SPECULARMAP":"",a.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",a.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",a.roughnessMap?"#define USE_ROUGHNESSMAP":"",a.metalnessMap?"#define USE_METALNESSMAP":"",a.alphaMap?"#define USE_ALPHAMAP":"",a.alphaHash?"#define USE_ALPHAHASH":"",a.transmission?"#define USE_TRANSMISSION":"",a.transmissionMap?"#define USE_TRANSMISSIONMAP":"",a.thicknessMap?"#define USE_THICKNESSMAP":"",a.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",a.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",a.mapUv?"#define MAP_UV "+a.mapUv:"",a.alphaMapUv?"#define ALPHAMAP_UV "+a.alphaMapUv:"",a.lightMapUv?"#define LIGHTMAP_UV "+a.lightMapUv:"",a.aoMapUv?"#define AOMAP_UV "+a.aoMapUv:"",a.emissiveMapUv?"#define EMISSIVEMAP_UV "+a.emissiveMapUv:"",a.bumpMapUv?"#define BUMPMAP_UV "+a.bumpMapUv:"",a.normalMapUv?"#define NORMALMAP_UV "+a.normalMapUv:"",a.displacementMapUv?"#define DISPLACEMENTMAP_UV "+a.displacementMapUv:"",a.metalnessMapUv?"#define METALNESSMAP_UV "+a.metalnessMapUv:"",a.roughnessMapUv?"#define ROUGHNESSMAP_UV "+a.roughnessMapUv:"",a.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+a.anisotropyMapUv:"",a.clearcoatMapUv?"#define CLEARCOATMAP_UV "+a.clearcoatMapUv:"",a.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+a.clearcoatNormalMapUv:"",a.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+a.clearcoatRoughnessMapUv:"",a.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+a.iridescenceMapUv:"",a.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+a.iridescenceThicknessMapUv:"",a.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+a.sheenColorMapUv:"",a.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+a.sheenRoughnessMapUv:"",a.specularMapUv?"#define SPECULARMAP_UV "+a.specularMapUv:"",a.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+a.specularColorMapUv:"",a.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+a.specularIntensityMapUv:"",a.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+a.transmissionMapUv:"",a.thicknessMapUv?"#define THICKNESSMAP_UV "+a.thicknessMapUv:"",a.vertexTangents&&a.flatShading===!1?"#define USE_TANGENT":"",a.vertexColors?"#define USE_COLOR":"",a.vertexAlphas?"#define USE_COLOR_ALPHA":"",a.vertexUv1s?"#define USE_UV1":"",a.vertexUv2s?"#define USE_UV2":"",a.vertexUv3s?"#define USE_UV3":"",a.pointsUvs?"#define USE_POINTS_UV":"",a.flatShading?"#define FLAT_SHADED":"",a.skinning?"#define USE_SKINNING":"",a.morphTargets?"#define USE_MORPHTARGETS":"",a.morphNormals&&a.flatShading===!1?"#define USE_MORPHNORMALS":"",a.morphColors?"#define USE_MORPHCOLORS":"",a.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+a.morphTextureStride:"",a.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+a.morphTargetsCount:"",a.doubleSided?"#define DOUBLE_SIDED":"",a.flipSided?"#define FLIP_SIDED":"",a.shadowMapEnabled?"#define USE_SHADOWMAP":"",a.shadowMapEnabled?"#define "+p:"",a.sizeAttenuation?"#define USE_SIZEATTENUATION":"",a.numLightProbes>0?"#define USE_LIGHT_PROBES":"",a.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",a.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Gr).join(`
`),m=[ph(a),"#define SHADER_TYPE "+a.shaderType,"#define SHADER_NAME "+a.shaderName,U,a.useFog&&a.fog?"#define USE_FOG":"",a.useFog&&a.fogExp2?"#define FOG_EXP2":"",a.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",a.map?"#define USE_MAP":"",a.matcap?"#define USE_MATCAP":"",a.envMap?"#define USE_ENVMAP":"",a.envMap?"#define "+g:"",a.envMap?"#define "+E:"",a.envMap?"#define "+_:"",v?"#define CUBEUV_TEXEL_WIDTH "+v.texelWidth:"",v?"#define CUBEUV_TEXEL_HEIGHT "+v.texelHeight:"",v?"#define CUBEUV_MAX_MIP "+v.maxMip+".0":"",a.lightMap?"#define USE_LIGHTMAP":"",a.aoMap?"#define USE_AOMAP":"",a.bumpMap?"#define USE_BUMPMAP":"",a.normalMap?"#define USE_NORMALMAP":"",a.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",a.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",a.emissiveMap?"#define USE_EMISSIVEMAP":"",a.anisotropy?"#define USE_ANISOTROPY":"",a.anisotropyMap?"#define USE_ANISOTROPYMAP":"",a.clearcoat?"#define USE_CLEARCOAT":"",a.clearcoatMap?"#define USE_CLEARCOATMAP":"",a.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",a.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",a.dispersion?"#define USE_DISPERSION":"",a.iridescence?"#define USE_IRIDESCENCE":"",a.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",a.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",a.specularMap?"#define USE_SPECULARMAP":"",a.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",a.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",a.roughnessMap?"#define USE_ROUGHNESSMAP":"",a.metalnessMap?"#define USE_METALNESSMAP":"",a.alphaMap?"#define USE_ALPHAMAP":"",a.alphaTest?"#define USE_ALPHATEST":"",a.alphaHash?"#define USE_ALPHAHASH":"",a.sheen?"#define USE_SHEEN":"",a.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",a.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",a.transmission?"#define USE_TRANSMISSION":"",a.transmissionMap?"#define USE_TRANSMISSIONMAP":"",a.thicknessMap?"#define USE_THICKNESSMAP":"",a.vertexTangents&&a.flatShading===!1?"#define USE_TANGENT":"",a.vertexColors||a.instancingColor||a.batchingColor?"#define USE_COLOR":"",a.vertexAlphas?"#define USE_COLOR_ALPHA":"",a.vertexUv1s?"#define USE_UV1":"",a.vertexUv2s?"#define USE_UV2":"",a.vertexUv3s?"#define USE_UV3":"",a.pointsUvs?"#define USE_POINTS_UV":"",a.gradientMap?"#define USE_GRADIENTMAP":"",a.flatShading?"#define FLAT_SHADED":"",a.doubleSided?"#define DOUBLE_SIDED":"",a.flipSided?"#define FLIP_SIDED":"",a.shadowMapEnabled?"#define USE_SHADOWMAP":"",a.shadowMapEnabled?"#define "+p:"",a.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",a.numLightProbes>0?"#define USE_LIGHT_PROBES":"",a.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",a.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",a.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",a.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",a.toneMapping!==sa?"#define TONE_MAPPING":"",a.toneMapping!==sa?rt.tonemapping_pars_fragment:"",a.toneMapping!==sa?lM("toneMapping",a.toneMapping):"",a.dithering?"#define DITHERING":"",a.opaque?"#define OPAQUE":"",rt.colorspace_pars_fragment,oM("linearToOutputTexel",a.outputColorSpace),cM(),a.useDepthPacking?"#define DEPTH_PACKING "+a.depthPacking:"",`
`].filter(Gr).join(`
`)),u=Uu(u),u=uh(u,a),u=fh(u,a),d=Uu(d),d=uh(d,a),d=fh(d,a),u=dh(u),d=dh(d),a.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,T=[S,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+T,m=["#define varying in",a.glslVersion===qp?"":"layout(location = 0) out highp vec4 pc_fragColor;",a.glslVersion===qp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const R=x+T+u,b=x+m+d,P=oh(o,o.VERTEX_SHADER,R),N=oh(o,o.FRAGMENT_SHADER,b);o.attachShader(w,P),o.attachShader(w,N),a.index0AttributeName!==void 0?o.bindAttribLocation(w,0,a.index0AttributeName):a.morphTargets===!0&&o.bindAttribLocation(w,0,"position"),o.linkProgram(w);function O(L){if(t.debug.checkShaderErrors){const F=o.getProgramInfoLog(w)||"",W=o.getShaderInfoLog(P)||"",Q=o.getShaderInfoLog(N)||"",te=F.trim(),G=W.trim(),ne=Q.trim();let K=!0,de=!0;if(o.getProgramParameter(w,o.LINK_STATUS)===!1)if(K=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(o,w,P,N);else{const xe=ch(o,P,"vertex"),Qe=ch(o,N,"fragment");console.error("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(w,o.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+te+`
`+xe+`
`+Qe)}else te!==""?console.warn("THREE.WebGLProgram: Program Info Log:",te):(G===""||ne==="")&&(de=!1);de&&(L.diagnostics={runnable:K,programLog:te,vertexShader:{log:G,prefix:T},fragmentShader:{log:ne,prefix:m}})}o.deleteShader(P),o.deleteShader(N),I=new il(o,w),y=dM(o,w)}let I;this.getUniforms=function(){return I===void 0&&O(this),I};let y;this.getAttributes=function(){return y===void 0&&O(this),y};let M=a.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=o.getProgramParameter(w,iM)),M},this.destroy=function(){r.releaseStatesOfProgram(this),o.deleteProgram(w),this.program=void 0},this.type=a.shaderType,this.name=a.shaderName,this.id=aM++,this.cacheKey=i,this.usedTimes=1,this.program=w,this.vertexShader=P,this.fragmentShader=N,this}let xM=0;class AM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(i){const a=i.vertexShader,r=i.fragmentShader,o=this._getShaderStage(a),c=this._getShaderStage(r),u=this._getShaderCacheForMaterial(i);return u.has(o)===!1&&(u.add(o),o.usedTimes++),u.has(c)===!1&&(u.add(c),c.usedTimes++),this}remove(i){const a=this.materialCache.get(i);for(const r of a)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(i),this}getVertexShaderID(i){return this._getShaderStage(i.vertexShader).id}getFragmentShaderID(i){return this._getShaderStage(i.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(i){const a=this.materialCache;let r=a.get(i);return r===void 0&&(r=new Set,a.set(i,r)),r}_getShaderStage(i){const a=this.shaderCache;let r=a.get(i);return r===void 0&&(r=new RM(i),a.set(i,r)),r}}class RM{constructor(i){this.id=xM++,this.code=i,this.usedTimes=0}}function bM(t,i,a,r,o,c,u){const d=new N_,p=new AM,g=new Set,E=[],_=o.logarithmicDepthBuffer,v=o.vertexTextures;let S=o.precision;const U={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(y){return g.add(y),y===0?"uv":`uv${y}`}function T(y,M,L,F,W){const Q=F.fog,te=W.geometry,G=y.isMeshStandardMaterial?F.environment:null,ne=(y.isMeshStandardMaterial?a:i).get(y.envMap||G),K=ne&&ne.mapping===hl?ne.image.height:null,de=U[y.type];y.precision!==null&&(S=o.getMaxPrecision(y.precision),S!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",S,"instead."));const xe=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,Qe=xe!==void 0?xe.length:0;let ot=0;te.morphAttributes.position!==void 0&&(ot=1),te.morphAttributes.normal!==void 0&&(ot=2),te.morphAttributes.color!==void 0&&(ot=3);let Ut,mt,lt,oe;if(de){const vt=Ii[de];Ut=vt.vertexShader,mt=vt.fragmentShader}else Ut=y.vertexShader,mt=y.fragmentShader,p.update(y),lt=p.getVertexShaderID(y),oe=p.getFragmentShaderID(y);const ue=t.getRenderTarget(),Ue=t.state.buffers.depth.getReversed(),Ze=W.isInstancedMesh===!0,He=W.isBatchedMesh===!0,st=!!y.map,Kt=!!y.matcap,H=!!ne,Ct=!!y.aoMap,Je=!!y.lightMap,qe=!!y.bumpMap,De=!!y.normalMap,Lt=!!y.displacementMap,Ne=!!y.emissiveMap,ke=!!y.metalnessMap,Ft=!!y.roughnessMap,kt=y.anisotropy>0,B=y.clearcoat>0,A=y.dispersion>0,j=y.iridescence>0,se=y.sheen>0,fe=y.transmission>0,ae=kt&&!!y.anisotropyMap,Fe=B&&!!y.clearcoatMap,Se=B&&!!y.clearcoatNormalMap,Be=B&&!!y.clearcoatRoughnessMap,Oe=j&&!!y.iridescenceMap,pe=j&&!!y.iridescenceThicknessMap,Me=se&&!!y.sheenColorMap,Ve=se&&!!y.sheenRoughnessMap,Ie=!!y.specularMap,ye=!!y.specularColorMap,$e=!!y.specularIntensityMap,V=fe&&!!y.transmissionMap,ge=fe&&!!y.thicknessMap,Ee=!!y.gradientMap,we=!!y.alphaMap,he=y.alphaTest>0,ce=!!y.alphaHash,Le=!!y.extensions;let je=sa;y.toneMapped&&(ue===null||ue.isXRRenderTarget===!0)&&(je=t.toneMapping);const Et={shaderID:de,shaderType:y.type,shaderName:y.name,vertexShader:Ut,fragmentShader:mt,defines:y.defines,customVertexShaderID:lt,customFragmentShaderID:oe,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:S,batching:He,batchingColor:He&&W._colorsTexture!==null,instancing:Ze,instancingColor:Ze&&W.instanceColor!==null,instancingMorph:Ze&&W.morphTexture!==null,supportsVertexTextures:v,outputColorSpace:ue===null?t.outputColorSpace:ue.isXRRenderTarget===!0?ue.texture.colorSpace:js,alphaToCoverage:!!y.alphaToCoverage,map:st,matcap:Kt,envMap:H,envMapMode:H&&ne.mapping,envMapCubeUVHeight:K,aoMap:Ct,lightMap:Je,bumpMap:qe,normalMap:De,displacementMap:v&&Lt,emissiveMap:Ne,normalMapObjectSpace:De&&y.normalMapType===C_,normalMapTangentSpace:De&&y.normalMapType===U_,metalnessMap:ke,roughnessMap:Ft,anisotropy:kt,anisotropyMap:ae,clearcoat:B,clearcoatMap:Fe,clearcoatNormalMap:Se,clearcoatRoughnessMap:Be,dispersion:A,iridescence:j,iridescenceMap:Oe,iridescenceThicknessMap:pe,sheen:se,sheenColorMap:Me,sheenRoughnessMap:Ve,specularMap:Ie,specularColorMap:ye,specularIntensityMap:$e,transmission:fe,transmissionMap:V,thicknessMap:ge,gradientMap:Ee,opaque:y.transparent===!1&&y.blending===nl&&y.alphaToCoverage===!1,alphaMap:we,alphaTest:he,alphaHash:ce,combine:y.combine,mapUv:st&&w(y.map.channel),aoMapUv:Ct&&w(y.aoMap.channel),lightMapUv:Je&&w(y.lightMap.channel),bumpMapUv:qe&&w(y.bumpMap.channel),normalMapUv:De&&w(y.normalMap.channel),displacementMapUv:Lt&&w(y.displacementMap.channel),emissiveMapUv:Ne&&w(y.emissiveMap.channel),metalnessMapUv:ke&&w(y.metalnessMap.channel),roughnessMapUv:Ft&&w(y.roughnessMap.channel),anisotropyMapUv:ae&&w(y.anisotropyMap.channel),clearcoatMapUv:Fe&&w(y.clearcoatMap.channel),clearcoatNormalMapUv:Se&&w(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Be&&w(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Oe&&w(y.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&w(y.iridescenceThicknessMap.channel),sheenColorMapUv:Me&&w(y.sheenColorMap.channel),sheenRoughnessMapUv:Ve&&w(y.sheenRoughnessMap.channel),specularMapUv:Ie&&w(y.specularMap.channel),specularColorMapUv:ye&&w(y.specularColorMap.channel),specularIntensityMapUv:$e&&w(y.specularIntensityMap.channel),transmissionMapUv:V&&w(y.transmissionMap.channel),thicknessMapUv:ge&&w(y.thicknessMap.channel),alphaMapUv:we&&w(y.alphaMap.channel),vertexTangents:!!te.attributes.tangent&&(De||kt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,pointsUvs:W.isPoints===!0&&!!te.attributes.uv&&(st||we),fog:!!Q,useFog:y.fog===!0,fogExp2:!!Q&&Q.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:_,reversedDepthBuffer:Ue,skinning:W.isSkinnedMesh===!0,morphTargets:te.morphAttributes.position!==void 0,morphNormals:te.morphAttributes.normal!==void 0,morphColors:te.morphAttributes.color!==void 0,morphTargetsCount:Qe,morphTextureStride:ot,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:u.numPlanes,numClipIntersection:u.numIntersection,dithering:y.dithering,shadowMapEnabled:t.shadowMap.enabled&&L.length>0,shadowMapType:t.shadowMap.type,toneMapping:je,decodeVideoTexture:st&&y.map.isVideoTexture===!0&&nn.getTransfer(y.map.colorSpace)===Vt,decodeVideoTextureEmissive:Ne&&y.emissiveMap.isVideoTexture===!0&&nn.getTransfer(y.emissiveMap.colorSpace)===Vt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Rn,flipSided:y.side===gn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Le&&y.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Le&&y.extensions.multiDraw===!0||He)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Et.vertexUv1s=g.has(1),Et.vertexUv2s=g.has(2),Et.vertexUv3s=g.has(3),g.clear(),Et}function m(y){const M=[];if(y.shaderID?M.push(y.shaderID):(M.push(y.customVertexShaderID),M.push(y.customFragmentShaderID)),y.defines!==void 0)for(const L in y.defines)M.push(L),M.push(y.defines[L]);return y.isRawShaderMaterial===!1&&(x(M,y),R(M,y),M.push(t.outputColorSpace)),M.push(y.customProgramCacheKey),M.join()}function x(y,M){y.push(M.precision),y.push(M.outputColorSpace),y.push(M.envMapMode),y.push(M.envMapCubeUVHeight),y.push(M.mapUv),y.push(M.alphaMapUv),y.push(M.lightMapUv),y.push(M.aoMapUv),y.push(M.bumpMapUv),y.push(M.normalMapUv),y.push(M.displacementMapUv),y.push(M.emissiveMapUv),y.push(M.metalnessMapUv),y.push(M.roughnessMapUv),y.push(M.anisotropyMapUv),y.push(M.clearcoatMapUv),y.push(M.clearcoatNormalMapUv),y.push(M.clearcoatRoughnessMapUv),y.push(M.iridescenceMapUv),y.push(M.iridescenceThicknessMapUv),y.push(M.sheenColorMapUv),y.push(M.sheenRoughnessMapUv),y.push(M.specularMapUv),y.push(M.specularColorMapUv),y.push(M.specularIntensityMapUv),y.push(M.transmissionMapUv),y.push(M.thicknessMapUv),y.push(M.combine),y.push(M.fogExp2),y.push(M.sizeAttenuation),y.push(M.morphTargetsCount),y.push(M.morphAttributeCount),y.push(M.numDirLights),y.push(M.numPointLights),y.push(M.numSpotLights),y.push(M.numSpotLightMaps),y.push(M.numHemiLights),y.push(M.numRectAreaLights),y.push(M.numDirLightShadows),y.push(M.numPointLightShadows),y.push(M.numSpotLightShadows),y.push(M.numSpotLightShadowsWithMaps),y.push(M.numLightProbes),y.push(M.shadowMapType),y.push(M.toneMapping),y.push(M.numClippingPlanes),y.push(M.numClipIntersection),y.push(M.depthPacking)}function R(y,M){d.disableAll(),M.supportsVertexTextures&&d.enable(0),M.instancing&&d.enable(1),M.instancingColor&&d.enable(2),M.instancingMorph&&d.enable(3),M.matcap&&d.enable(4),M.envMap&&d.enable(5),M.normalMapObjectSpace&&d.enable(6),M.normalMapTangentSpace&&d.enable(7),M.clearcoat&&d.enable(8),M.iridescence&&d.enable(9),M.alphaTest&&d.enable(10),M.vertexColors&&d.enable(11),M.vertexAlphas&&d.enable(12),M.vertexUv1s&&d.enable(13),M.vertexUv2s&&d.enable(14),M.vertexUv3s&&d.enable(15),M.vertexTangents&&d.enable(16),M.anisotropy&&d.enable(17),M.alphaHash&&d.enable(18),M.batching&&d.enable(19),M.dispersion&&d.enable(20),M.batchingColor&&d.enable(21),M.gradientMap&&d.enable(22),y.push(d.mask),d.disableAll(),M.fog&&d.enable(0),M.useFog&&d.enable(1),M.flatShading&&d.enable(2),M.logarithmicDepthBuffer&&d.enable(3),M.reversedDepthBuffer&&d.enable(4),M.skinning&&d.enable(5),M.morphTargets&&d.enable(6),M.morphNormals&&d.enable(7),M.morphColors&&d.enable(8),M.premultipliedAlpha&&d.enable(9),M.shadowMapEnabled&&d.enable(10),M.doubleSided&&d.enable(11),M.flipSided&&d.enable(12),M.useDepthPacking&&d.enable(13),M.dithering&&d.enable(14),M.transmission&&d.enable(15),M.sheen&&d.enable(16),M.opaque&&d.enable(17),M.pointsUvs&&d.enable(18),M.decodeVideoTexture&&d.enable(19),M.decodeVideoTextureEmissive&&d.enable(20),M.alphaToCoverage&&d.enable(21),y.push(d.mask)}function b(y){const M=U[y.type];let L;if(M){const F=Ii[M];L=b_.clone(F.uniforms)}else L=y.uniforms;return L}function P(y,M){let L;for(let F=0,W=E.length;F<W;F++){const Q=E[F];if(Q.cacheKey===M){L=Q,++L.usedTimes;break}}return L===void 0&&(L=new yM(t,M,y,c),E.push(L)),L}function N(y){if(--y.usedTimes===0){const M=E.indexOf(y);E[M]=E[E.length-1],E.pop(),y.destroy()}}function O(y){p.remove(y)}function I(){p.dispose()}return{getParameters:T,getProgramCacheKey:m,getUniforms:b,acquireProgram:P,releaseProgram:N,releaseShaderCache:O,programs:E,dispose:I}}function UM(){let t=new WeakMap;function i(u){return t.has(u)}function a(u){let d=t.get(u);return d===void 0&&(d={},t.set(u,d)),d}function r(u){t.delete(u)}function o(u,d,p){t.get(u)[d]=p}function c(){t=new WeakMap}return{has:i,get:a,remove:r,update:o,dispose:c}}function CM(t,i){return t.groupOrder!==i.groupOrder?t.groupOrder-i.groupOrder:t.renderOrder!==i.renderOrder?t.renderOrder-i.renderOrder:t.material.id!==i.material.id?t.material.id-i.material.id:t.z!==i.z?t.z-i.z:t.id-i.id}function hh(t,i){return t.groupOrder!==i.groupOrder?t.groupOrder-i.groupOrder:t.renderOrder!==i.renderOrder?t.renderOrder-i.renderOrder:t.z!==i.z?i.z-t.z:t.id-i.id}function mh(){const t=[];let i=0;const a=[],r=[],o=[];function c(){i=0,a.length=0,r.length=0,o.length=0}function u(_,v,S,U,w,T){let m=t[i];return m===void 0?(m={id:_.id,object:_,geometry:v,material:S,groupOrder:U,renderOrder:_.renderOrder,z:w,group:T},t[i]=m):(m.id=_.id,m.object=_,m.geometry=v,m.material=S,m.groupOrder=U,m.renderOrder=_.renderOrder,m.z=w,m.group=T),i++,m}function d(_,v,S,U,w,T){const m=u(_,v,S,U,w,T);S.transmission>0?r.push(m):S.transparent===!0?o.push(m):a.push(m)}function p(_,v,S,U,w,T){const m=u(_,v,S,U,w,T);S.transmission>0?r.unshift(m):S.transparent===!0?o.unshift(m):a.unshift(m)}function g(_,v){a.length>1&&a.sort(_||CM),r.length>1&&r.sort(v||hh),o.length>1&&o.sort(v||hh)}function E(){for(let _=i,v=t.length;_<v;_++){const S=t[_];if(S.id===null)break;S.id=null,S.object=null,S.geometry=null,S.material=null,S.group=null}}return{opaque:a,transmissive:r,transparent:o,init:c,push:d,unshift:p,finish:E,sort:g}}function DM(){let t=new WeakMap;function i(r,o){const c=t.get(r);let u;return c===void 0?(u=new mh,t.set(r,[u])):o>=c.length?(u=new mh,c.push(u)):u=c[o],u}function a(){t=new WeakMap}return{get:i,dispose:a}}function wM(){const t={};return{get:function(i){if(t[i.id]!==void 0)return t[i.id];let a;switch(i.type){case"DirectionalLight":a={direction:new le,color:new at};break;case"SpotLight":a={position:new le,direction:new le,color:new at,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":a={position:new le,color:new at,distance:0,decay:0};break;case"HemisphereLight":a={direction:new le,skyColor:new at,groundColor:new at};break;case"RectAreaLight":a={color:new at,position:new le,halfWidth:new le,halfHeight:new le};break}return t[i.id]=a,a}}}function PM(){const t={};return{get:function(i){if(t[i.id]!==void 0)return t[i.id];let a;switch(i.type){case"DirectionalLight":a={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"SpotLight":a={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"PointLight":a={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[i.id]=a,a}}}let NM=0;function LM(t,i){return(i.castShadow?2:0)-(t.castShadow?2:0)+(i.map?1:0)-(t.map?1:0)}function BM(t){const i=new wM,a=PM(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let g=0;g<9;g++)r.probe.push(new le);const o=new le,c=new Bn,u=new Bn;function d(g){let E=0,_=0,v=0;for(let y=0;y<9;y++)r.probe[y].set(0,0,0);let S=0,U=0,w=0,T=0,m=0,x=0,R=0,b=0,P=0,N=0,O=0;g.sort(LM);for(let y=0,M=g.length;y<M;y++){const L=g[y],F=L.color,W=L.intensity,Q=L.distance,te=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)E+=F.r*W,_+=F.g*W,v+=F.b*W;else if(L.isLightProbe){for(let G=0;G<9;G++)r.probe[G].addScaledVector(L.sh.coefficients[G],W);O++}else if(L.isDirectionalLight){const G=i.get(L);if(G.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const ne=L.shadow,K=a.get(L);K.shadowIntensity=ne.intensity,K.shadowBias=ne.bias,K.shadowNormalBias=ne.normalBias,K.shadowRadius=ne.radius,K.shadowMapSize=ne.mapSize,r.directionalShadow[S]=K,r.directionalShadowMap[S]=te,r.directionalShadowMatrix[S]=L.shadow.matrix,x++}r.directional[S]=G,S++}else if(L.isSpotLight){const G=i.get(L);G.position.setFromMatrixPosition(L.matrixWorld),G.color.copy(F).multiplyScalar(W),G.distance=Q,G.coneCos=Math.cos(L.angle),G.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),G.decay=L.decay,r.spot[w]=G;const ne=L.shadow;if(L.map&&(r.spotLightMap[P]=L.map,P++,ne.updateMatrices(L),L.castShadow&&N++),r.spotLightMatrix[w]=ne.matrix,L.castShadow){const K=a.get(L);K.shadowIntensity=ne.intensity,K.shadowBias=ne.bias,K.shadowNormalBias=ne.normalBias,K.shadowRadius=ne.radius,K.shadowMapSize=ne.mapSize,r.spotShadow[w]=K,r.spotShadowMap[w]=te,b++}w++}else if(L.isRectAreaLight){const G=i.get(L);G.color.copy(F).multiplyScalar(W),G.halfWidth.set(L.width*.5,0,0),G.halfHeight.set(0,L.height*.5,0),r.rectArea[T]=G,T++}else if(L.isPointLight){const G=i.get(L);if(G.color.copy(L.color).multiplyScalar(L.intensity),G.distance=L.distance,G.decay=L.decay,L.castShadow){const ne=L.shadow,K=a.get(L);K.shadowIntensity=ne.intensity,K.shadowBias=ne.bias,K.shadowNormalBias=ne.normalBias,K.shadowRadius=ne.radius,K.shadowMapSize=ne.mapSize,K.shadowCameraNear=ne.camera.near,K.shadowCameraFar=ne.camera.far,r.pointShadow[U]=K,r.pointShadowMap[U]=te,r.pointShadowMatrix[U]=L.shadow.matrix,R++}r.point[U]=G,U++}else if(L.isHemisphereLight){const G=i.get(L);G.skyColor.copy(L.color).multiplyScalar(W),G.groundColor.copy(L.groundColor).multiplyScalar(W),r.hemi[m]=G,m++}}T>0&&(t.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Ae.LTC_FLOAT_1,r.rectAreaLTC2=Ae.LTC_FLOAT_2):(r.rectAreaLTC1=Ae.LTC_HALF_1,r.rectAreaLTC2=Ae.LTC_HALF_2)),r.ambient[0]=E,r.ambient[1]=_,r.ambient[2]=v;const I=r.hash;(I.directionalLength!==S||I.pointLength!==U||I.spotLength!==w||I.rectAreaLength!==T||I.hemiLength!==m||I.numDirectionalShadows!==x||I.numPointShadows!==R||I.numSpotShadows!==b||I.numSpotMaps!==P||I.numLightProbes!==O)&&(r.directional.length=S,r.spot.length=w,r.rectArea.length=T,r.point.length=U,r.hemi.length=m,r.directionalShadow.length=x,r.directionalShadowMap.length=x,r.pointShadow.length=R,r.pointShadowMap.length=R,r.spotShadow.length=b,r.spotShadowMap.length=b,r.directionalShadowMatrix.length=x,r.pointShadowMatrix.length=R,r.spotLightMatrix.length=b+P-N,r.spotLightMap.length=P,r.numSpotLightShadowsWithMaps=N,r.numLightProbes=O,I.directionalLength=S,I.pointLength=U,I.spotLength=w,I.rectAreaLength=T,I.hemiLength=m,I.numDirectionalShadows=x,I.numPointShadows=R,I.numSpotShadows=b,I.numSpotMaps=P,I.numLightProbes=O,r.version=NM++)}function p(g,E){let _=0,v=0,S=0,U=0,w=0;const T=E.matrixWorldInverse;for(let m=0,x=g.length;m<x;m++){const R=g[m];if(R.isDirectionalLight){const b=r.directional[_];b.direction.setFromMatrixPosition(R.matrixWorld),o.setFromMatrixPosition(R.target.matrixWorld),b.direction.sub(o),b.direction.transformDirection(T),_++}else if(R.isSpotLight){const b=r.spot[S];b.position.setFromMatrixPosition(R.matrixWorld),b.position.applyMatrix4(T),b.direction.setFromMatrixPosition(R.matrixWorld),o.setFromMatrixPosition(R.target.matrixWorld),b.direction.sub(o),b.direction.transformDirection(T),S++}else if(R.isRectAreaLight){const b=r.rectArea[U];b.position.setFromMatrixPosition(R.matrixWorld),b.position.applyMatrix4(T),u.identity(),c.copy(R.matrixWorld),c.premultiply(T),u.extractRotation(c),b.halfWidth.set(R.width*.5,0,0),b.halfHeight.set(0,R.height*.5,0),b.halfWidth.applyMatrix4(u),b.halfHeight.applyMatrix4(u),U++}else if(R.isPointLight){const b=r.point[v];b.position.setFromMatrixPosition(R.matrixWorld),b.position.applyMatrix4(T),v++}else if(R.isHemisphereLight){const b=r.hemi[w];b.direction.setFromMatrixPosition(R.matrixWorld),b.direction.transformDirection(T),w++}}}return{setup:d,setupView:p,state:r}}function vh(t){const i=new BM(t),a=[],r=[];function o(E){g.camera=E,a.length=0,r.length=0}function c(E){a.push(E)}function u(E){r.push(E)}function d(){i.setup(a)}function p(E){i.setupView(a,E)}const g={lightsArray:a,shadowsArray:r,camera:null,lights:i,transmissionRenderTarget:{}};return{init:o,state:g,setupLights:d,setupLightsView:p,pushLight:c,pushShadow:u}}function OM(t){let i=new WeakMap;function a(o,c=0){const u=i.get(o);let d;return u===void 0?(d=new vh(t),i.set(o,[d])):c>=u.length?(d=new vh(t),u.push(d)):d=u[c],d}function r(){i=new WeakMap}return{get:a,dispose:r}}const IM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,FM=`uniform sampler2D shadow_pass;
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
}`;function HM(t,i,a){let r=new Kh;const o=new Ye,c=new Ye,u=new An,d=new h_({depthPacking:m_}),p=new v_,g={},E=a.maxTextureSize,_={[Pa]:gn,[gn]:Pa,[Rn]:Rn},v=new rn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ye},radius:{value:4}},vertexShader:IM,fragmentShader:FM}),S=v.clone();S.defines.HORIZONTAL_PASS=1;const U=new as;U.setAttribute("position",new ii(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new gi(U,v),T=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=jh;let m=this.type;this.render=function(N,O,I){if(T.enabled===!1||T.autoUpdate===!1&&T.needsUpdate===!1||N.length===0)return;const y=t.getRenderTarget(),M=t.getActiveCubeFace(),L=t.getActiveMipmapLevel(),F=t.state;F.setBlending(Xn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const W=m!==ta&&this.type===ta,Q=m===ta&&this.type!==ta;for(let te=0,G=N.length;te<G;te++){const ne=N[te],K=ne.shadow;if(K===void 0){console.warn("THREE.WebGLShadowMap:",ne,"has no shadow.");continue}if(K.autoUpdate===!1&&K.needsUpdate===!1)continue;o.copy(K.mapSize);const de=K.getFrameExtents();if(o.multiply(de),c.copy(K.mapSize),(o.x>E||o.y>E)&&(o.x>E&&(c.x=Math.floor(E/de.x),o.x=c.x*de.x,K.mapSize.x=c.x),o.y>E&&(c.y=Math.floor(E/de.y),o.y=c.y*de.y,K.mapSize.y=c.y)),K.map===null||W===!0||Q===!0){const Qe=this.type!==ta?{minFilter:yi,magFilter:yi}:{};K.map!==null&&K.map.dispose(),K.map=new $t(o.x,o.y,Qe),K.map.texture.name=ne.name+".shadowMap",K.camera.updateProjectionMatrix()}t.setRenderTarget(K.map),t.clear();const xe=K.getViewportCount();for(let Qe=0;Qe<xe;Qe++){const ot=K.getViewport(Qe);u.set(c.x*ot.x,c.y*ot.y,c.x*ot.z,c.y*ot.w),F.viewport(u),K.updateMatrices(ne,Qe),r=K.getFrustum(),b(O,I,K.camera,ne,this.type)}K.isPointLightShadow!==!0&&this.type===ta&&x(K,I),K.needsUpdate=!1}m=this.type,T.needsUpdate=!1,t.setRenderTarget(y,M,L)};function x(N,O){const I=i.update(w);v.defines.VSM_SAMPLES!==N.blurSamples&&(v.defines.VSM_SAMPLES=N.blurSamples,S.defines.VSM_SAMPLES=N.blurSamples,v.needsUpdate=!0,S.needsUpdate=!0),N.mapPass===null&&(N.mapPass=new $t(o.x,o.y)),v.uniforms.shadow_pass.value=N.map.texture,v.uniforms.resolution.value=N.mapSize,v.uniforms.radius.value=N.radius,t.setRenderTarget(N.mapPass),t.clear(),t.renderBufferDirect(O,null,I,v,w,null),S.uniforms.shadow_pass.value=N.mapPass.texture,S.uniforms.resolution.value=N.mapSize,S.uniforms.radius.value=N.radius,t.setRenderTarget(N.map),t.clear(),t.renderBufferDirect(O,null,I,S,w,null)}function R(N,O,I,y){let M=null;const L=I.isPointLight===!0?N.customDistanceMaterial:N.customDepthMaterial;if(L!==void 0)M=L;else if(M=I.isPointLight===!0?p:d,t.localClippingEnabled&&O.clipShadows===!0&&Array.isArray(O.clippingPlanes)&&O.clippingPlanes.length!==0||O.displacementMap&&O.displacementScale!==0||O.alphaMap&&O.alphaTest>0||O.map&&O.alphaTest>0||O.alphaToCoverage===!0){const F=M.uuid,W=O.uuid;let Q=g[F];Q===void 0&&(Q={},g[F]=Q);let te=Q[W];te===void 0&&(te=M.clone(),Q[W]=te,O.addEventListener("dispose",P)),M=te}if(M.visible=O.visible,M.wireframe=O.wireframe,y===ta?M.side=O.shadowSide!==null?O.shadowSide:O.side:M.side=O.shadowSide!==null?O.shadowSide:_[O.side],M.alphaMap=O.alphaMap,M.alphaTest=O.alphaToCoverage===!0?.5:O.alphaTest,M.map=O.map,M.clipShadows=O.clipShadows,M.clippingPlanes=O.clippingPlanes,M.clipIntersection=O.clipIntersection,M.displacementMap=O.displacementMap,M.displacementScale=O.displacementScale,M.displacementBias=O.displacementBias,M.wireframeLinewidth=O.wireframeLinewidth,M.linewidth=O.linewidth,I.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=t.properties.get(M);F.light=I}return M}function b(N,O,I,y,M){if(N.visible===!1)return;if(N.layers.test(O.layers)&&(N.isMesh||N.isLine||N.isPoints)&&(N.castShadow||N.receiveShadow&&M===ta)&&(!N.frustumCulled||r.intersectsObject(N))){N.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,N.matrixWorld);const W=i.update(N),Q=N.material;if(Array.isArray(Q)){const te=W.groups;for(let G=0,ne=te.length;G<ne;G++){const K=te[G],de=Q[K.materialIndex];if(de&&de.visible){const xe=R(N,de,y,M);N.onBeforeShadow(t,N,O,I,W,xe,K),t.renderBufferDirect(I,null,W,xe,N,K),N.onAfterShadow(t,N,O,I,W,xe,K)}}}else if(Q.visible){const te=R(N,Q,y,M);N.onBeforeShadow(t,N,O,I,W,te,null),t.renderBufferDirect(I,null,W,te,N,null),N.onAfterShadow(t,N,O,I,W,te,null)}}const F=N.children;for(let W=0,Q=F.length;W<Q;W++)b(F[W],O,I,y,M)}function P(N){N.target.removeEventListener("dispose",P);for(const I in g){const y=g[I],M=N.target.uuid;M in y&&(y[M].dispose(),delete y[M])}}}const zM={[xu]:cl,[yu]:Eu,[Mu]:Su,[rl]:Tu,[cl]:xu,[Eu]:yu,[Su]:Mu,[Tu]:rl};function GM(t,i){function a(){let V=!1;const ge=new An;let Ee=null;const we=new An(0,0,0,0);return{setMask:function(he){Ee!==he&&!V&&(t.colorMask(he,he,he,he),Ee=he)},setLocked:function(he){V=he},setClear:function(he,ce,Le,je,Et){Et===!0&&(he*=je,ce*=je,Le*=je),ge.set(he,ce,Le,je),we.equals(ge)===!1&&(t.clearColor(he,ce,Le,je),we.copy(ge))},reset:function(){V=!1,Ee=null,we.set(-1,0,0,0)}}}function r(){let V=!1,ge=!1,Ee=null,we=null,he=null;return{setReversed:function(ce){if(ge!==ce){const Le=i.get("EXT_clip_control");ce?Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.ZERO_TO_ONE_EXT):Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.NEGATIVE_ONE_TO_ONE_EXT),ge=ce;const je=he;he=null,this.setClear(je)}},getReversed:function(){return ge},setTest:function(ce){ce?ue(t.DEPTH_TEST):Ue(t.DEPTH_TEST)},setMask:function(ce){Ee!==ce&&!V&&(t.depthMask(ce),Ee=ce)},setFunc:function(ce){if(ge&&(ce=zM[ce]),we!==ce){switch(ce){case xu:t.depthFunc(t.NEVER);break;case cl:t.depthFunc(t.ALWAYS);break;case yu:t.depthFunc(t.LESS);break;case rl:t.depthFunc(t.LEQUAL);break;case Mu:t.depthFunc(t.EQUAL);break;case Tu:t.depthFunc(t.GEQUAL);break;case Eu:t.depthFunc(t.GREATER);break;case Su:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}we=ce}},setLocked:function(ce){V=ce},setClear:function(ce){he!==ce&&(ge&&(ce=1-ce),t.clearDepth(ce),he=ce)},reset:function(){V=!1,Ee=null,we=null,he=null,ge=!1}}}function o(){let V=!1,ge=null,Ee=null,we=null,he=null,ce=null,Le=null,je=null,Et=null;return{setTest:function(vt){V||(vt?ue(t.STENCIL_TEST):Ue(t.STENCIL_TEST))},setMask:function(vt){ge!==vt&&!V&&(t.stencilMask(vt),ge=vt)},setFunc:function(vt,si,qn){(Ee!==vt||we!==si||he!==qn)&&(t.stencilFunc(vt,si,qn),Ee=vt,we=si,he=qn)},setOp:function(vt,si,qn){(ce!==vt||Le!==si||je!==qn)&&(t.stencilOp(vt,si,qn),ce=vt,Le=si,je=qn)},setLocked:function(vt){V=vt},setClear:function(vt){Et!==vt&&(t.clearStencil(vt),Et=vt)},reset:function(){V=!1,ge=null,Ee=null,we=null,he=null,ce=null,Le=null,je=null,Et=null}}}const c=new a,u=new r,d=new o,p=new WeakMap,g=new WeakMap;let E={},_={},v=new WeakMap,S=[],U=null,w=!1,T=null,m=null,x=null,R=null,b=null,P=null,N=null,O=new at(0,0,0),I=0,y=!1,M=null,L=null,F=null,W=null,Q=null;const te=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,ne=0;const K=t.getParameter(t.VERSION);K.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(K)[1]),G=ne>=1):K.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),G=ne>=2);let de=null,xe={};const Qe=t.getParameter(t.SCISSOR_BOX),ot=t.getParameter(t.VIEWPORT),Ut=new An().fromArray(Qe),mt=new An().fromArray(ot);function lt(V,ge,Ee,we){const he=new Uint8Array(4),ce=t.createTexture();t.bindTexture(V,ce),t.texParameteri(V,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(V,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Le=0;Le<Ee;Le++)V===t.TEXTURE_3D||V===t.TEXTURE_2D_ARRAY?t.texImage3D(ge,0,t.RGBA,1,1,we,0,t.RGBA,t.UNSIGNED_BYTE,he):t.texImage2D(ge+Le,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,he);return ce}const oe={};oe[t.TEXTURE_2D]=lt(t.TEXTURE_2D,t.TEXTURE_2D,1),oe[t.TEXTURE_CUBE_MAP]=lt(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[t.TEXTURE_2D_ARRAY]=lt(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),oe[t.TEXTURE_3D]=lt(t.TEXTURE_3D,t.TEXTURE_3D,1,1),c.setClear(0,0,0,1),u.setClear(1),d.setClear(0),ue(t.DEPTH_TEST),u.setFunc(rl),qe(!1),De(zp),ue(t.CULL_FACE),Ct(Xn);function ue(V){E[V]!==!0&&(t.enable(V),E[V]=!0)}function Ue(V){E[V]!==!1&&(t.disable(V),E[V]=!1)}function Ze(V,ge){return _[V]!==ge?(t.bindFramebuffer(V,ge),_[V]=ge,V===t.DRAW_FRAMEBUFFER&&(_[t.FRAMEBUFFER]=ge),V===t.FRAMEBUFFER&&(_[t.DRAW_FRAMEBUFFER]=ge),!0):!1}function He(V,ge){let Ee=S,we=!1;if(V){Ee=v.get(ge),Ee===void 0&&(Ee=[],v.set(ge,Ee));const he=V.textures;if(Ee.length!==he.length||Ee[0]!==t.COLOR_ATTACHMENT0){for(let ce=0,Le=he.length;ce<Le;ce++)Ee[ce]=t.COLOR_ATTACHMENT0+ce;Ee.length=he.length,we=!0}}else Ee[0]!==t.BACK&&(Ee[0]=t.BACK,we=!0);we&&t.drawBuffers(Ee)}function st(V){return U!==V?(t.useProgram(V),U=V,!0):!1}const Kt={[Cr]:t.FUNC_ADD,[Vg]:t.FUNC_SUBTRACT,[Gg]:t.FUNC_REVERSE_SUBTRACT};Kt[K_]=t.MIN,Kt[Q_]=t.MAX;const H={[i_]:t.ZERO,[n_]:t.ONE,[t_]:t.SRC_COLOR,[e_]:t.SRC_ALPHA,[$g]:t.SRC_ALPHA_SATURATE,[Jg]:t.DST_COLOR,[jg]:t.DST_ALPHA,[Zg]:t.ONE_MINUS_SRC_COLOR,[Qg]:t.ONE_MINUS_SRC_ALPHA,[Kg]:t.ONE_MINUS_DST_COLOR,[Yg]:t.ONE_MINUS_DST_ALPHA,[kg]:t.CONSTANT_COLOR,[qg]:t.ONE_MINUS_CONSTANT_COLOR,[Wg]:t.CONSTANT_ALPHA,[Xg]:t.ONE_MINUS_CONSTANT_ALPHA};function Ct(V,ge,Ee,we,he,ce,Le,je,Et,vt){if(V===Xn){w===!0&&(Ue(t.BLEND),w=!1);return}if(w===!1&&(ue(t.BLEND),w=!0),V!==A_){if(V!==T||vt!==y){if((m!==Cr||b!==Cr)&&(t.blendEquation(t.FUNC_ADD),m=Cr,b=Cr),vt)switch(V){case nl:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case qs:t.blendFunc(t.ONE,t.ONE);break;case Vp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Gp:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case nl:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case qs:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case Vp:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Gp:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}x=null,R=null,P=null,N=null,O.set(0,0,0),I=0,T=V,y=vt}return}he=he||ge,ce=ce||Ee,Le=Le||we,(ge!==m||he!==b)&&(t.blendEquationSeparate(Kt[ge],Kt[he]),m=ge,b=he),(Ee!==x||we!==R||ce!==P||Le!==N)&&(t.blendFuncSeparate(H[Ee],H[we],H[ce],H[Le]),x=Ee,R=we,P=ce,N=Le),(je.equals(O)===!1||Et!==I)&&(t.blendColor(je.r,je.g,je.b,Et),O.copy(je),I=Et),T=V,y=!1}function Je(V,ge){V.side===Rn?Ue(t.CULL_FACE):ue(t.CULL_FACE);let Ee=V.side===gn;ge&&(Ee=!Ee),qe(Ee),V.blending===nl&&V.transparent===!1?Ct(Xn):Ct(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),u.setFunc(V.depthFunc),u.setTest(V.depthTest),u.setMask(V.depthWrite),c.setMask(V.colorWrite);const we=V.stencilWrite;d.setTest(we),we&&(d.setMask(V.stencilWriteMask),d.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),d.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),Ne(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?ue(t.SAMPLE_ALPHA_TO_COVERAGE):Ue(t.SAMPLE_ALPHA_TO_COVERAGE)}function qe(V){M!==V&&(V?t.frontFace(t.CW):t.frontFace(t.CCW),M=V)}function De(V){V!==y_?(ue(t.CULL_FACE),V!==L&&(V===zp?t.cullFace(t.BACK):V===x_?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Ue(t.CULL_FACE),L=V}function Lt(V){V!==F&&(G&&t.lineWidth(V),F=V)}function Ne(V,ge,Ee){V?(ue(t.POLYGON_OFFSET_FILL),(W!==ge||Q!==Ee)&&(t.polygonOffset(ge,Ee),W=ge,Q=Ee)):Ue(t.POLYGON_OFFSET_FILL)}function ke(V){V?ue(t.SCISSOR_TEST):Ue(t.SCISSOR_TEST)}function Ft(V){V===void 0&&(V=t.TEXTURE0+te-1),de!==V&&(t.activeTexture(V),de=V)}function kt(V,ge,Ee){Ee===void 0&&(de===null?Ee=t.TEXTURE0+te-1:Ee=de);let we=xe[Ee];we===void 0&&(we={type:void 0,texture:void 0},xe[Ee]=we),(we.type!==V||we.texture!==ge)&&(de!==Ee&&(t.activeTexture(Ee),de=Ee),t.bindTexture(V,ge||oe[V]),we.type=V,we.texture=ge)}function B(){const V=xe[de];V!==void 0&&V.type!==void 0&&(t.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function A(){try{t.compressedTexImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function j(){try{t.compressedTexImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function se(){try{t.texSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function fe(){try{t.texSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ae(){try{t.compressedTexSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Fe(){try{t.compressedTexSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Se(){try{t.texStorage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Be(){try{t.texStorage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Oe(){try{t.texImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function pe(){try{t.texImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Me(V){Ut.equals(V)===!1&&(t.scissor(V.x,V.y,V.z,V.w),Ut.copy(V))}function Ve(V){mt.equals(V)===!1&&(t.viewport(V.x,V.y,V.z,V.w),mt.copy(V))}function Ie(V,ge){let Ee=g.get(ge);Ee===void 0&&(Ee=new WeakMap,g.set(ge,Ee));let we=Ee.get(V);we===void 0&&(we=t.getUniformBlockIndex(ge,V.name),Ee.set(V,we))}function ye(V,ge){const we=g.get(ge).get(V);p.get(ge)!==we&&(t.uniformBlockBinding(ge,we,V.__bindingPointIndex),p.set(ge,we))}function $e(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),u.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),E={},de=null,xe={},_={},v=new WeakMap,S=[],U=null,w=!1,T=null,m=null,x=null,R=null,b=null,P=null,N=null,O=new at(0,0,0),I=0,y=!1,M=null,L=null,F=null,W=null,Q=null,Ut.set(0,0,t.canvas.width,t.canvas.height),mt.set(0,0,t.canvas.width,t.canvas.height),c.reset(),u.reset(),d.reset()}return{buffers:{color:c,depth:u,stencil:d},enable:ue,disable:Ue,bindFramebuffer:Ze,drawBuffers:He,useProgram:st,setBlending:Ct,setMaterial:Je,setFlipSided:qe,setCullFace:De,setLineWidth:Lt,setPolygonOffset:Ne,setScissorTest:ke,activeTexture:Ft,bindTexture:kt,unbindTexture:B,compressedTexImage2D:A,compressedTexImage3D:j,texImage2D:Oe,texImage3D:pe,updateUBOMapping:Ie,uniformBlockBinding:ye,texStorage2D:Se,texStorage3D:Be,texSubImage2D:se,texSubImage3D:fe,compressedTexSubImage2D:ae,compressedTexSubImage3D:Fe,scissor:Me,viewport:Ve,reset:$e}}function VM(t,i,a,r,o,c,u){const d=i.has("WEBGL_multisampled_render_to_texture")?i.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),g=new Ye,E=new WeakMap;let _;const v=new WeakMap;let S=!1;try{S=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function U(B,A){return S?new OffscreenCanvas(B,A):W_("canvas")}function w(B,A,j){let se=1;const fe=kt(B);if((fe.width>j||fe.height>j)&&(se=j/Math.max(fe.width,fe.height)),se<1)if(typeof HTMLImageElement<"u"&&B instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&B instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&B instanceof ImageBitmap||typeof VideoFrame<"u"&&B instanceof VideoFrame){const ae=Math.floor(se*fe.width),Fe=Math.floor(se*fe.height);_===void 0&&(_=U(ae,Fe));const Se=A?U(ae,Fe):_;return Se.width=ae,Se.height=Fe,Se.getContext("2d").drawImage(B,0,0,ae,Fe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+fe.width+"x"+fe.height+") to ("+ae+"x"+Fe+")."),Se}else return"data"in B&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+fe.width+"x"+fe.height+")."),B;return B}function T(B){return B.generateMipmaps}function m(B){t.generateMipmap(B)}function x(B){return B.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:B.isWebGL3DRenderTarget?t.TEXTURE_3D:B.isWebGLArrayRenderTarget||B.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function R(B,A,j,se,fe=!1){if(B!==null){if(t[B]!==void 0)return t[B];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+B+"'")}let ae=A;if(A===t.RED&&(j===t.FLOAT&&(ae=t.R32F),j===t.HALF_FLOAT&&(ae=t.R16F),j===t.UNSIGNED_BYTE&&(ae=t.R8)),A===t.RED_INTEGER&&(j===t.UNSIGNED_BYTE&&(ae=t.R8UI),j===t.UNSIGNED_SHORT&&(ae=t.R16UI),j===t.UNSIGNED_INT&&(ae=t.R32UI),j===t.BYTE&&(ae=t.R8I),j===t.SHORT&&(ae=t.R16I),j===t.INT&&(ae=t.R32I)),A===t.RG&&(j===t.FLOAT&&(ae=t.RG32F),j===t.HALF_FLOAT&&(ae=t.RG16F),j===t.UNSIGNED_BYTE&&(ae=t.RG8)),A===t.RG_INTEGER&&(j===t.UNSIGNED_BYTE&&(ae=t.RG8UI),j===t.UNSIGNED_SHORT&&(ae=t.RG16UI),j===t.UNSIGNED_INT&&(ae=t.RG32UI),j===t.BYTE&&(ae=t.RG8I),j===t.SHORT&&(ae=t.RG16I),j===t.INT&&(ae=t.RG32I)),A===t.RGB_INTEGER&&(j===t.UNSIGNED_BYTE&&(ae=t.RGB8UI),j===t.UNSIGNED_SHORT&&(ae=t.RGB16UI),j===t.UNSIGNED_INT&&(ae=t.RGB32UI),j===t.BYTE&&(ae=t.RGB8I),j===t.SHORT&&(ae=t.RGB16I),j===t.INT&&(ae=t.RGB32I)),A===t.RGBA_INTEGER&&(j===t.UNSIGNED_BYTE&&(ae=t.RGBA8UI),j===t.UNSIGNED_SHORT&&(ae=t.RGBA16UI),j===t.UNSIGNED_INT&&(ae=t.RGBA32UI),j===t.BYTE&&(ae=t.RGBA8I),j===t.SHORT&&(ae=t.RGBA16I),j===t.INT&&(ae=t.RGBA32I)),A===t.RGB&&(j===t.UNSIGNED_INT_5_9_9_9_REV&&(ae=t.RGB9_E5),j===t.UNSIGNED_INT_10F_11F_11F_REV&&(ae=t.R11F_G11F_B10F)),A===t.RGBA){const Fe=fe?um:nn.getTransfer(se);j===t.FLOAT&&(ae=t.RGBA32F),j===t.HALF_FLOAT&&(ae=t.RGBA16F),j===t.UNSIGNED_BYTE&&(ae=Fe===Vt?t.SRGB8_ALPHA8:t.RGBA8),j===t.UNSIGNED_SHORT_4_4_4_4&&(ae=t.RGBA4),j===t.UNSIGNED_SHORT_5_5_5_1&&(ae=t.RGB5_A1)}return(ae===t.R16F||ae===t.R32F||ae===t.RG16F||ae===t.RG32F||ae===t.RGBA16F||ae===t.RGBA32F)&&i.get("EXT_color_buffer_float"),ae}function b(B,A){let j;return B?A===null||A===Ks||A===Ys?j=t.DEPTH24_STENCIL8:A===_i?j=t.DEPTH32F_STENCIL8:A===ol&&(j=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Ks||A===Ys?j=t.DEPTH_COMPONENT24:A===_i?j=t.DEPTH_COMPONENT32F:A===ol&&(j=t.DEPTH_COMPONENT16),j}function P(B,A){return T(B)===!0||B.isFramebufferTexture&&B.minFilter!==yi&&B.minFilter!==Hi?Math.log2(Math.max(A.width,A.height))+1:B.mipmaps!==void 0&&B.mipmaps.length>0?B.mipmaps.length:B.isCompressedTexture&&Array.isArray(B.image)?A.mipmaps.length:1}function N(B){const A=B.target;A.removeEventListener("dispose",N),I(A),A.isVideoTexture&&E.delete(A)}function O(B){const A=B.target;A.removeEventListener("dispose",O),M(A)}function I(B){const A=r.get(B);if(A.__webglInit===void 0)return;const j=B.source,se=v.get(j);if(se){const fe=se[A.__cacheKey];fe.usedTimes--,fe.usedTimes===0&&y(B),Object.keys(se).length===0&&v.delete(j)}r.remove(B)}function y(B){const A=r.get(B);t.deleteTexture(A.__webglTexture);const j=B.source,se=v.get(j);delete se[A.__cacheKey],u.memory.textures--}function M(B){const A=r.get(B);if(B.depthTexture&&(B.depthTexture.dispose(),r.remove(B.depthTexture)),B.isWebGLCubeRenderTarget)for(let se=0;se<6;se++){if(Array.isArray(A.__webglFramebuffer[se]))for(let fe=0;fe<A.__webglFramebuffer[se].length;fe++)t.deleteFramebuffer(A.__webglFramebuffer[se][fe]);else t.deleteFramebuffer(A.__webglFramebuffer[se]);A.__webglDepthbuffer&&t.deleteRenderbuffer(A.__webglDepthbuffer[se])}else{if(Array.isArray(A.__webglFramebuffer))for(let se=0;se<A.__webglFramebuffer.length;se++)t.deleteFramebuffer(A.__webglFramebuffer[se]);else t.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&t.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&t.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let se=0;se<A.__webglColorRenderbuffer.length;se++)A.__webglColorRenderbuffer[se]&&t.deleteRenderbuffer(A.__webglColorRenderbuffer[se]);A.__webglDepthRenderbuffer&&t.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const j=B.textures;for(let se=0,fe=j.length;se<fe;se++){const ae=r.get(j[se]);ae.__webglTexture&&(t.deleteTexture(ae.__webglTexture),u.memory.textures--),r.remove(j[se])}r.remove(B)}let L=0;function F(){L=0}function W(){const B=L;return B>=o.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+B+" texture units while this GPU supports only "+o.maxTextures),L+=1,B}function Q(B){const A=[];return A.push(B.wrapS),A.push(B.wrapT),A.push(B.wrapR||0),A.push(B.magFilter),A.push(B.minFilter),A.push(B.anisotropy),A.push(B.internalFormat),A.push(B.format),A.push(B.type),A.push(B.generateMipmaps),A.push(B.premultiplyAlpha),A.push(B.flipY),A.push(B.unpackAlignment),A.push(B.colorSpace),A.join()}function te(B,A){const j=r.get(B);if(B.isVideoTexture&&ke(B),B.isRenderTargetTexture===!1&&B.isExternalTexture!==!0&&B.version>0&&j.__version!==B.version){const se=B.image;if(se===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(se.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{oe(j,B,A);return}}else B.isExternalTexture&&(j.__webglTexture=B.sourceTexture?B.sourceTexture:null);a.bindTexture(t.TEXTURE_2D,j.__webglTexture,t.TEXTURE0+A)}function G(B,A){const j=r.get(B);if(B.isRenderTargetTexture===!1&&B.version>0&&j.__version!==B.version){oe(j,B,A);return}a.bindTexture(t.TEXTURE_2D_ARRAY,j.__webglTexture,t.TEXTURE0+A)}function ne(B,A){const j=r.get(B);if(B.isRenderTargetTexture===!1&&B.version>0&&j.__version!==B.version){oe(j,B,A);return}a.bindTexture(t.TEXTURE_3D,j.__webglTexture,t.TEXTURE0+A)}function K(B,A){const j=r.get(B);if(B.version>0&&j.__version!==B.version){ue(j,B,A);return}a.bindTexture(t.TEXTURE_CUBE_MAP,j.__webglTexture,t.TEXTURE0+A)}const de={[Qh]:t.REPEAT,[s_]:t.CLAMP_TO_EDGE,[a_]:t.MIRRORED_REPEAT},xe={[yi]:t.NEAREST,[r_]:t.NEAREST_MIPMAP_NEAREST,[No]:t.NEAREST_MIPMAP_LINEAR,[Hi]:t.LINEAR,[Gc]:t.LINEAR_MIPMAP_NEAREST,[Fr]:t.LINEAR_MIPMAP_LINEAR},Qe={[p_]:t.NEVER,[d_]:t.ALWAYS,[f_]:t.LESS,[Zh]:t.LEQUAL,[u_]:t.EQUAL,[c_]:t.GEQUAL,[l_]:t.GREATER,[o_]:t.NOTEQUAL};function ot(B,A){if(A.type===_i&&i.has("OES_texture_float_linear")===!1&&(A.magFilter===Hi||A.magFilter===Gc||A.magFilter===No||A.magFilter===Fr||A.minFilter===Hi||A.minFilter===Gc||A.minFilter===No||A.minFilter===Fr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(B,t.TEXTURE_WRAP_S,de[A.wrapS]),t.texParameteri(B,t.TEXTURE_WRAP_T,de[A.wrapT]),(B===t.TEXTURE_3D||B===t.TEXTURE_2D_ARRAY)&&t.texParameteri(B,t.TEXTURE_WRAP_R,de[A.wrapR]),t.texParameteri(B,t.TEXTURE_MAG_FILTER,xe[A.magFilter]),t.texParameteri(B,t.TEXTURE_MIN_FILTER,xe[A.minFilter]),A.compareFunction&&(t.texParameteri(B,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(B,t.TEXTURE_COMPARE_FUNC,Qe[A.compareFunction])),i.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===yi||A.minFilter!==No&&A.minFilter!==Fr||A.type===_i&&i.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||r.get(A).__currentAnisotropy){const j=i.get("EXT_texture_filter_anisotropic");t.texParameterf(B,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,o.getMaxAnisotropy())),r.get(A).__currentAnisotropy=A.anisotropy}}}function Ut(B,A){let j=!1;B.__webglInit===void 0&&(B.__webglInit=!0,A.addEventListener("dispose",N));const se=A.source;let fe=v.get(se);fe===void 0&&(fe={},v.set(se,fe));const ae=Q(A);if(ae!==B.__cacheKey){fe[ae]===void 0&&(fe[ae]={texture:t.createTexture(),usedTimes:0},u.memory.textures++,j=!0),fe[ae].usedTimes++;const Fe=fe[B.__cacheKey];Fe!==void 0&&(fe[B.__cacheKey].usedTimes--,Fe.usedTimes===0&&y(A)),B.__cacheKey=ae,B.__webglTexture=fe[ae].texture}return j}function mt(B,A,j){return Math.floor(Math.floor(B/j)/A)}function lt(B,A,j,se){const ae=B.updateRanges;if(ae.length===0)a.texSubImage2D(t.TEXTURE_2D,0,0,0,A.width,A.height,j,se,A.data);else{ae.sort((pe,Me)=>pe.start-Me.start);let Fe=0;for(let pe=1;pe<ae.length;pe++){const Me=ae[Fe],Ve=ae[pe],Ie=Me.start+Me.count,ye=mt(Ve.start,A.width,4),$e=mt(Me.start,A.width,4);Ve.start<=Ie+1&&ye===$e&&mt(Ve.start+Ve.count-1,A.width,4)===ye?Me.count=Math.max(Me.count,Ve.start+Ve.count-Me.start):(++Fe,ae[Fe]=Ve)}ae.length=Fe+1;const Se=t.getParameter(t.UNPACK_ROW_LENGTH),Be=t.getParameter(t.UNPACK_SKIP_PIXELS),Oe=t.getParameter(t.UNPACK_SKIP_ROWS);t.pixelStorei(t.UNPACK_ROW_LENGTH,A.width);for(let pe=0,Me=ae.length;pe<Me;pe++){const Ve=ae[pe],Ie=Math.floor(Ve.start/4),ye=Math.ceil(Ve.count/4),$e=Ie%A.width,V=Math.floor(Ie/A.width),ge=ye,Ee=1;t.pixelStorei(t.UNPACK_SKIP_PIXELS,$e),t.pixelStorei(t.UNPACK_SKIP_ROWS,V),a.texSubImage2D(t.TEXTURE_2D,0,$e,V,ge,Ee,j,se,A.data)}B.clearUpdateRanges(),t.pixelStorei(t.UNPACK_ROW_LENGTH,Se),t.pixelStorei(t.UNPACK_SKIP_PIXELS,Be),t.pixelStorei(t.UNPACK_SKIP_ROWS,Oe)}}function oe(B,A,j){let se=t.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(se=t.TEXTURE_2D_ARRAY),A.isData3DTexture&&(se=t.TEXTURE_3D);const fe=Ut(B,A),ae=A.source;a.bindTexture(se,B.__webglTexture,t.TEXTURE0+j);const Fe=r.get(ae);if(ae.version!==Fe.__version||fe===!0){a.activeTexture(t.TEXTURE0+j);const Se=nn.getPrimaries(nn.workingColorSpace),Be=A.colorSpace===ba?null:nn.getPrimaries(A.colorSpace),Oe=A.colorSpace===ba||Se===Be?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,A.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,A.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Oe);let pe=w(A.image,!1,o.maxTextureSize);pe=Ft(A,pe);const Me=c.convert(A.format,A.colorSpace),Ve=c.convert(A.type);let Ie=R(A.internalFormat,Me,Ve,A.colorSpace,A.isVideoTexture);ot(se,A);let ye;const $e=A.mipmaps,V=A.isVideoTexture!==!0,ge=Fe.__version===void 0||fe===!0,Ee=ae.dataReady,we=P(A,pe);if(A.isDepthTexture)Ie=b(A.format===kr,A.type),ge&&(V?a.texStorage2D(t.TEXTURE_2D,1,Ie,pe.width,pe.height):a.texImage2D(t.TEXTURE_2D,0,Ie,pe.width,pe.height,0,Me,Ve,null));else if(A.isDataTexture)if($e.length>0){V&&ge&&a.texStorage2D(t.TEXTURE_2D,we,Ie,$e[0].width,$e[0].height);for(let he=0,ce=$e.length;he<ce;he++)ye=$e[he],V?Ee&&a.texSubImage2D(t.TEXTURE_2D,he,0,0,ye.width,ye.height,Me,Ve,ye.data):a.texImage2D(t.TEXTURE_2D,he,Ie,ye.width,ye.height,0,Me,Ve,ye.data);A.generateMipmaps=!1}else V?(ge&&a.texStorage2D(t.TEXTURE_2D,we,Ie,pe.width,pe.height),Ee&&lt(A,pe,Me,Ve)):a.texImage2D(t.TEXTURE_2D,0,Ie,pe.width,pe.height,0,Me,Ve,pe.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){V&&ge&&a.texStorage3D(t.TEXTURE_2D_ARRAY,we,Ie,$e[0].width,$e[0].height,pe.depth);for(let he=0,ce=$e.length;he<ce;he++)if(ye=$e[he],A.format!==bn)if(Me!==null)if(V){if(Ee)if(A.layerUpdates.size>0){const Le=Wp(ye.width,ye.height,A.format,A.type);for(const je of A.layerUpdates){const Et=ye.data.subarray(je*Le/ye.data.BYTES_PER_ELEMENT,(je+1)*Le/ye.data.BYTES_PER_ELEMENT);a.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,he,0,0,je,ye.width,ye.height,1,Me,Et)}A.clearLayerUpdates()}else a.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,he,0,0,0,ye.width,ye.height,pe.depth,Me,ye.data)}else a.compressedTexImage3D(t.TEXTURE_2D_ARRAY,he,Ie,ye.width,ye.height,pe.depth,0,ye.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else V?Ee&&a.texSubImage3D(t.TEXTURE_2D_ARRAY,he,0,0,0,ye.width,ye.height,pe.depth,Me,Ve,ye.data):a.texImage3D(t.TEXTURE_2D_ARRAY,he,Ie,ye.width,ye.height,pe.depth,0,Me,Ve,ye.data)}else{V&&ge&&a.texStorage2D(t.TEXTURE_2D,we,Ie,$e[0].width,$e[0].height);for(let he=0,ce=$e.length;he<ce;he++)ye=$e[he],A.format!==bn?Me!==null?V?Ee&&a.compressedTexSubImage2D(t.TEXTURE_2D,he,0,0,ye.width,ye.height,Me,ye.data):a.compressedTexImage2D(t.TEXTURE_2D,he,Ie,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):V?Ee&&a.texSubImage2D(t.TEXTURE_2D,he,0,0,ye.width,ye.height,Me,Ve,ye.data):a.texImage2D(t.TEXTURE_2D,he,Ie,ye.width,ye.height,0,Me,Ve,ye.data)}else if(A.isDataArrayTexture)if(V){if(ge&&a.texStorage3D(t.TEXTURE_2D_ARRAY,we,Ie,pe.width,pe.height,pe.depth),Ee)if(A.layerUpdates.size>0){const he=Wp(pe.width,pe.height,A.format,A.type);for(const ce of A.layerUpdates){const Le=pe.data.subarray(ce*he/pe.data.BYTES_PER_ELEMENT,(ce+1)*he/pe.data.BYTES_PER_ELEMENT);a.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,ce,pe.width,pe.height,1,Me,Ve,Le)}A.clearLayerUpdates()}else a.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,pe.width,pe.height,pe.depth,Me,Ve,pe.data)}else a.texImage3D(t.TEXTURE_2D_ARRAY,0,Ie,pe.width,pe.height,pe.depth,0,Me,Ve,pe.data);else if(A.isData3DTexture)V?(ge&&a.texStorage3D(t.TEXTURE_3D,we,Ie,pe.width,pe.height,pe.depth),Ee&&a.texSubImage3D(t.TEXTURE_3D,0,0,0,0,pe.width,pe.height,pe.depth,Me,Ve,pe.data)):a.texImage3D(t.TEXTURE_3D,0,Ie,pe.width,pe.height,pe.depth,0,Me,Ve,pe.data);else if(A.isFramebufferTexture){if(ge)if(V)a.texStorage2D(t.TEXTURE_2D,we,Ie,pe.width,pe.height);else{let he=pe.width,ce=pe.height;for(let Le=0;Le<we;Le++)a.texImage2D(t.TEXTURE_2D,Le,Ie,he,ce,0,Me,Ve,null),he>>=1,ce>>=1}}else if($e.length>0){if(V&&ge){const he=kt($e[0]);a.texStorage2D(t.TEXTURE_2D,we,Ie,he.width,he.height)}for(let he=0,ce=$e.length;he<ce;he++)ye=$e[he],V?Ee&&a.texSubImage2D(t.TEXTURE_2D,he,0,0,Me,Ve,ye):a.texImage2D(t.TEXTURE_2D,he,Ie,Me,Ve,ye);A.generateMipmaps=!1}else if(V){if(ge){const he=kt(pe);a.texStorage2D(t.TEXTURE_2D,we,Ie,he.width,he.height)}Ee&&a.texSubImage2D(t.TEXTURE_2D,0,0,0,Me,Ve,pe)}else a.texImage2D(t.TEXTURE_2D,0,Ie,Me,Ve,pe);T(A)&&m(se),Fe.__version=ae.version,A.onUpdate&&A.onUpdate(A)}B.__version=A.version}function ue(B,A,j){if(A.image.length!==6)return;const se=Ut(B,A),fe=A.source;a.bindTexture(t.TEXTURE_CUBE_MAP,B.__webglTexture,t.TEXTURE0+j);const ae=r.get(fe);if(fe.version!==ae.__version||se===!0){a.activeTexture(t.TEXTURE0+j);const Fe=nn.getPrimaries(nn.workingColorSpace),Se=A.colorSpace===ba?null:nn.getPrimaries(A.colorSpace),Be=A.colorSpace===ba||Fe===Se?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,A.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,A.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Be);const Oe=A.isCompressedTexture||A.image[0].isCompressedTexture,pe=A.image[0]&&A.image[0].isDataTexture,Me=[];for(let ce=0;ce<6;ce++)!Oe&&!pe?Me[ce]=w(A.image[ce],!0,o.maxCubemapSize):Me[ce]=pe?A.image[ce].image:A.image[ce],Me[ce]=Ft(A,Me[ce]);const Ve=Me[0],Ie=c.convert(A.format,A.colorSpace),ye=c.convert(A.type),$e=R(A.internalFormat,Ie,ye,A.colorSpace),V=A.isVideoTexture!==!0,ge=ae.__version===void 0||se===!0,Ee=fe.dataReady;let we=P(A,Ve);ot(t.TEXTURE_CUBE_MAP,A);let he;if(Oe){V&&ge&&a.texStorage2D(t.TEXTURE_CUBE_MAP,we,$e,Ve.width,Ve.height);for(let ce=0;ce<6;ce++){he=Me[ce].mipmaps;for(let Le=0;Le<he.length;Le++){const je=he[Le];A.format!==bn?Ie!==null?V?Ee&&a.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Le,0,0,je.width,je.height,Ie,je.data):a.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Le,$e,je.width,je.height,0,je.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?Ee&&a.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Le,0,0,je.width,je.height,Ie,ye,je.data):a.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Le,$e,je.width,je.height,0,Ie,ye,je.data)}}}else{if(he=A.mipmaps,V&&ge){he.length>0&&we++;const ce=kt(Me[0]);a.texStorage2D(t.TEXTURE_CUBE_MAP,we,$e,ce.width,ce.height)}for(let ce=0;ce<6;ce++)if(pe){V?Ee&&a.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,0,0,Me[ce].width,Me[ce].height,Ie,ye,Me[ce].data):a.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,$e,Me[ce].width,Me[ce].height,0,Ie,ye,Me[ce].data);for(let Le=0;Le<he.length;Le++){const Et=he[Le].image[ce].image;V?Ee&&a.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Le+1,0,0,Et.width,Et.height,Ie,ye,Et.data):a.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Le+1,$e,Et.width,Et.height,0,Ie,ye,Et.data)}}else{V?Ee&&a.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,0,0,Ie,ye,Me[ce]):a.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,$e,Ie,ye,Me[ce]);for(let Le=0;Le<he.length;Le++){const je=he[Le];V?Ee&&a.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Le+1,0,0,Ie,ye,je.image[ce]):a.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Le+1,$e,Ie,ye,je.image[ce])}}}T(A)&&m(t.TEXTURE_CUBE_MAP),ae.__version=fe.version,A.onUpdate&&A.onUpdate(A)}B.__version=A.version}function Ue(B,A,j,se,fe,ae){const Fe=c.convert(j.format,j.colorSpace),Se=c.convert(j.type),Be=R(j.internalFormat,Fe,Se,j.colorSpace),Oe=r.get(A),pe=r.get(j);if(pe.__renderTarget=A,!Oe.__hasExternalTextures){const Me=Math.max(1,A.width>>ae),Ve=Math.max(1,A.height>>ae);fe===t.TEXTURE_3D||fe===t.TEXTURE_2D_ARRAY?a.texImage3D(fe,ae,Be,Me,Ve,A.depth,0,Fe,Se,null):a.texImage2D(fe,ae,Be,Me,Ve,0,Fe,Se,null)}a.bindFramebuffer(t.FRAMEBUFFER,B),Ne(A)?d.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,se,fe,pe.__webglTexture,0,Lt(A)):(fe===t.TEXTURE_2D||fe>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&fe<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,se,fe,pe.__webglTexture,ae),a.bindFramebuffer(t.FRAMEBUFFER,null)}function Ze(B,A,j){if(t.bindRenderbuffer(t.RENDERBUFFER,B),A.depthBuffer){const se=A.depthTexture,fe=se&&se.isDepthTexture?se.type:null,ae=b(A.stencilBuffer,fe),Fe=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Se=Lt(A);Ne(A)?d.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Se,ae,A.width,A.height):j?t.renderbufferStorageMultisample(t.RENDERBUFFER,Se,ae,A.width,A.height):t.renderbufferStorage(t.RENDERBUFFER,ae,A.width,A.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Fe,t.RENDERBUFFER,B)}else{const se=A.textures;for(let fe=0;fe<se.length;fe++){const ae=se[fe],Fe=c.convert(ae.format,ae.colorSpace),Se=c.convert(ae.type),Be=R(ae.internalFormat,Fe,Se,ae.colorSpace),Oe=Lt(A);j&&Ne(A)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Oe,Be,A.width,A.height):Ne(A)?d.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Oe,Be,A.width,A.height):t.renderbufferStorage(t.RENDERBUFFER,Be,A.width,A.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function He(B,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(a.bindFramebuffer(t.FRAMEBUFFER,B),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const se=r.get(A.depthTexture);se.__renderTarget=A,(!se.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),te(A.depthTexture,0);const fe=se.__webglTexture,ae=Lt(A);if(A.depthTexture.format===Vu)Ne(A)?d.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,fe,0,ae):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,fe,0);else if(A.depthTexture.format===kr)Ne(A)?d.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,fe,0,ae):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,fe,0);else throw new Error("Unknown depthTexture format")}function st(B){const A=r.get(B),j=B.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==B.depthTexture){const se=B.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),se){const fe=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,se.removeEventListener("dispose",fe)};se.addEventListener("dispose",fe),A.__depthDisposeCallback=fe}A.__boundDepthTexture=se}if(B.depthTexture&&!A.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");const se=B.texture.mipmaps;se&&se.length>0?He(A.__webglFramebuffer[0],B):He(A.__webglFramebuffer,B)}else if(j){A.__webglDepthbuffer=[];for(let se=0;se<6;se++)if(a.bindFramebuffer(t.FRAMEBUFFER,A.__webglFramebuffer[se]),A.__webglDepthbuffer[se]===void 0)A.__webglDepthbuffer[se]=t.createRenderbuffer(),Ze(A.__webglDepthbuffer[se],B,!1);else{const fe=B.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ae=A.__webglDepthbuffer[se];t.bindRenderbuffer(t.RENDERBUFFER,ae),t.framebufferRenderbuffer(t.FRAMEBUFFER,fe,t.RENDERBUFFER,ae)}}else{const se=B.texture.mipmaps;if(se&&se.length>0?a.bindFramebuffer(t.FRAMEBUFFER,A.__webglFramebuffer[0]):a.bindFramebuffer(t.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=t.createRenderbuffer(),Ze(A.__webglDepthbuffer,B,!1);else{const fe=B.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ae=A.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,ae),t.framebufferRenderbuffer(t.FRAMEBUFFER,fe,t.RENDERBUFFER,ae)}}a.bindFramebuffer(t.FRAMEBUFFER,null)}function Kt(B,A,j){const se=r.get(B);A!==void 0&&Ue(se.__webglFramebuffer,B,B.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),j!==void 0&&st(B)}function H(B){const A=B.texture,j=r.get(B),se=r.get(A);B.addEventListener("dispose",O);const fe=B.textures,ae=B.isWebGLCubeRenderTarget===!0,Fe=fe.length>1;if(Fe||(se.__webglTexture===void 0&&(se.__webglTexture=t.createTexture()),se.__version=A.version,u.memory.textures++),ae){j.__webglFramebuffer=[];for(let Se=0;Se<6;Se++)if(A.mipmaps&&A.mipmaps.length>0){j.__webglFramebuffer[Se]=[];for(let Be=0;Be<A.mipmaps.length;Be++)j.__webglFramebuffer[Se][Be]=t.createFramebuffer()}else j.__webglFramebuffer[Se]=t.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){j.__webglFramebuffer=[];for(let Se=0;Se<A.mipmaps.length;Se++)j.__webglFramebuffer[Se]=t.createFramebuffer()}else j.__webglFramebuffer=t.createFramebuffer();if(Fe)for(let Se=0,Be=fe.length;Se<Be;Se++){const Oe=r.get(fe[Se]);Oe.__webglTexture===void 0&&(Oe.__webglTexture=t.createTexture(),u.memory.textures++)}if(B.samples>0&&Ne(B)===!1){j.__webglMultisampledFramebuffer=t.createFramebuffer(),j.__webglColorRenderbuffer=[],a.bindFramebuffer(t.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let Se=0;Se<fe.length;Se++){const Be=fe[Se];j.__webglColorRenderbuffer[Se]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,j.__webglColorRenderbuffer[Se]);const Oe=c.convert(Be.format,Be.colorSpace),pe=c.convert(Be.type),Me=R(Be.internalFormat,Oe,pe,Be.colorSpace,B.isXRRenderTarget===!0),Ve=Lt(B);t.renderbufferStorageMultisample(t.RENDERBUFFER,Ve,Me,B.width,B.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Se,t.RENDERBUFFER,j.__webglColorRenderbuffer[Se])}t.bindRenderbuffer(t.RENDERBUFFER,null),B.depthBuffer&&(j.__webglDepthRenderbuffer=t.createRenderbuffer(),Ze(j.__webglDepthRenderbuffer,B,!0)),a.bindFramebuffer(t.FRAMEBUFFER,null)}}if(ae){a.bindTexture(t.TEXTURE_CUBE_MAP,se.__webglTexture),ot(t.TEXTURE_CUBE_MAP,A);for(let Se=0;Se<6;Se++)if(A.mipmaps&&A.mipmaps.length>0)for(let Be=0;Be<A.mipmaps.length;Be++)Ue(j.__webglFramebuffer[Se][Be],B,A,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Be);else Ue(j.__webglFramebuffer[Se],B,A,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0);T(A)&&m(t.TEXTURE_CUBE_MAP),a.unbindTexture()}else if(Fe){for(let Se=0,Be=fe.length;Se<Be;Se++){const Oe=fe[Se],pe=r.get(Oe);let Me=t.TEXTURE_2D;(B.isWebGL3DRenderTarget||B.isWebGLArrayRenderTarget)&&(Me=B.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),a.bindTexture(Me,pe.__webglTexture),ot(Me,Oe),Ue(j.__webglFramebuffer,B,Oe,t.COLOR_ATTACHMENT0+Se,Me,0),T(Oe)&&m(Me)}a.unbindTexture()}else{let Se=t.TEXTURE_2D;if((B.isWebGL3DRenderTarget||B.isWebGLArrayRenderTarget)&&(Se=B.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),a.bindTexture(Se,se.__webglTexture),ot(Se,A),A.mipmaps&&A.mipmaps.length>0)for(let Be=0;Be<A.mipmaps.length;Be++)Ue(j.__webglFramebuffer[Be],B,A,t.COLOR_ATTACHMENT0,Se,Be);else Ue(j.__webglFramebuffer,B,A,t.COLOR_ATTACHMENT0,Se,0);T(A)&&m(Se),a.unbindTexture()}B.depthBuffer&&st(B)}function Ct(B){const A=B.textures;for(let j=0,se=A.length;j<se;j++){const fe=A[j];if(T(fe)){const ae=x(B),Fe=r.get(fe).__webglTexture;a.bindTexture(ae,Fe),m(ae),a.unbindTexture()}}}const Je=[],qe=[];function De(B){if(B.samples>0){if(Ne(B)===!1){const A=B.textures,j=B.width,se=B.height;let fe=t.COLOR_BUFFER_BIT;const ae=B.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Fe=r.get(B),Se=A.length>1;if(Se)for(let Oe=0;Oe<A.length;Oe++)a.bindFramebuffer(t.FRAMEBUFFER,Fe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Oe,t.RENDERBUFFER,null),a.bindFramebuffer(t.FRAMEBUFFER,Fe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Oe,t.TEXTURE_2D,null,0);a.bindFramebuffer(t.READ_FRAMEBUFFER,Fe.__webglMultisampledFramebuffer);const Be=B.texture.mipmaps;Be&&Be.length>0?a.bindFramebuffer(t.DRAW_FRAMEBUFFER,Fe.__webglFramebuffer[0]):a.bindFramebuffer(t.DRAW_FRAMEBUFFER,Fe.__webglFramebuffer);for(let Oe=0;Oe<A.length;Oe++){if(B.resolveDepthBuffer&&(B.depthBuffer&&(fe|=t.DEPTH_BUFFER_BIT),B.stencilBuffer&&B.resolveStencilBuffer&&(fe|=t.STENCIL_BUFFER_BIT)),Se){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Fe.__webglColorRenderbuffer[Oe]);const pe=r.get(A[Oe]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,pe,0)}t.blitFramebuffer(0,0,j,se,0,0,j,se,fe,t.NEAREST),p===!0&&(Je.length=0,qe.length=0,Je.push(t.COLOR_ATTACHMENT0+Oe),B.depthBuffer&&B.resolveDepthBuffer===!1&&(Je.push(ae),qe.push(ae),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,qe)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Je))}if(a.bindFramebuffer(t.READ_FRAMEBUFFER,null),a.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),Se)for(let Oe=0;Oe<A.length;Oe++){a.bindFramebuffer(t.FRAMEBUFFER,Fe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Oe,t.RENDERBUFFER,Fe.__webglColorRenderbuffer[Oe]);const pe=r.get(A[Oe]).__webglTexture;a.bindFramebuffer(t.FRAMEBUFFER,Fe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Oe,t.TEXTURE_2D,pe,0)}a.bindFramebuffer(t.DRAW_FRAMEBUFFER,Fe.__webglMultisampledFramebuffer)}else if(B.depthBuffer&&B.resolveDepthBuffer===!1&&p){const A=B.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[A])}}}function Lt(B){return Math.min(o.maxSamples,B.samples)}function Ne(B){const A=r.get(B);return B.samples>0&&i.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function ke(B){const A=u.render.frame;E.get(B)!==A&&(E.set(B,A),B.update())}function Ft(B,A){const j=B.colorSpace,se=B.format,fe=B.type;return B.isCompressedTexture===!0||B.isVideoTexture===!0||j!==js&&j!==ba&&(nn.getTransfer(j)===Vt?(se!==bn||fe!==Cn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),A}function kt(B){return typeof HTMLImageElement<"u"&&B instanceof HTMLImageElement?(g.width=B.naturalWidth||B.width,g.height=B.naturalHeight||B.height):typeof VideoFrame<"u"&&B instanceof VideoFrame?(g.width=B.displayWidth,g.height=B.displayHeight):(g.width=B.width,g.height=B.height),g}this.allocateTextureUnit=W,this.resetTextureUnits=F,this.setTexture2D=te,this.setTexture2DArray=G,this.setTexture3D=ne,this.setTextureCube=K,this.rebindTextures=Kt,this.setupRenderTarget=H,this.updateRenderTargetMipmap=Ct,this.updateMultisampleRenderTarget=De,this.setupDepthRenderbuffer=st,this.setupFrameBufferTexture=Ue,this.useMultisampledRTT=Ne}function XM(t,i){function a(r,o=ba){let c;const u=nn.getTransfer(o);if(r===Cn)return t.UNSIGNED_BYTE;if(r===Jh)return t.UNSIGNED_SHORT_4_4_4_4;if(r===$h)return t.UNSIGNED_SHORT_5_5_5_1;if(r===g_)return t.UNSIGNED_INT_5_9_9_9_REV;if(r===__)return t.UNSIGNED_INT_10F_11F_11F_REV;if(r===S_)return t.BYTE;if(r===E_)return t.SHORT;if(r===ol)return t.UNSIGNED_SHORT;if(r===tm)return t.INT;if(r===Ks)return t.UNSIGNED_INT;if(r===_i)return t.FLOAT;if(r===Kr)return t.HALF_FLOAT;if(r===T_)return t.ALPHA;if(r===M_)return t.RGB;if(r===bn)return t.RGBA;if(r===Vu)return t.DEPTH_COMPONENT;if(r===kr)return t.DEPTH_STENCIL;if(r===qu)return t.RED;if(r===nm)return t.RED_INTEGER;if(r===im)return t.RG;if(r===am)return t.RG_INTEGER;if(r===sm)return t.RGBA_INTEGER;if(r===Vc||r===Xc||r===Wc||r===qc)if(u===Vt)if(c=i.get("WEBGL_compressed_texture_s3tc_srgb"),c!==null){if(r===Vc)return c.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Xc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Wc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===qc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(c=i.get("WEBGL_compressed_texture_s3tc"),c!==null){if(r===Vc)return c.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Xc)return c.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Wc)return c.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===qc)return c.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===dp||r===pp||r===hp||r===mp)if(c=i.get("WEBGL_compressed_texture_pvrtc"),c!==null){if(r===dp)return c.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===pp)return c.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===hp)return c.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===mp)return c.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===vp||r===gp||r===_p)if(c=i.get("WEBGL_compressed_texture_etc"),c!==null){if(r===vp||r===gp)return u===Vt?c.COMPRESSED_SRGB8_ETC2:c.COMPRESSED_RGB8_ETC2;if(r===_p)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:c.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Sp||r===Ep||r===Tp||r===Mp||r===yp||r===xp||r===Ap||r===Rp||r===bp||r===Up||r===Cp||r===Dp||r===wp||r===Pp)if(c=i.get("WEBGL_compressed_texture_astc"),c!==null){if(r===Sp)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:c.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Ep)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:c.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Tp)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:c.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Mp)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:c.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===yp)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:c.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===xp)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:c.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Ap)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:c.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Rp)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:c.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===bp)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:c.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Up)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:c.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Cp)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:c.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Dp)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:c.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===wp)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:c.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Pp)return u===Vt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:c.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Np||r===Lp||r===Bp)if(c=i.get("EXT_texture_compression_bptc"),c!==null){if(r===Np)return u===Vt?c.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:c.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Lp)return c.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Bp)return c.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Op||r===Ip||r===Fp||r===Hp)if(c=i.get("EXT_texture_compression_rgtc"),c!==null){if(r===Op)return c.COMPRESSED_RED_RGTC1_EXT;if(r===Ip)return c.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Fp)return c.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Hp)return c.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Ys?t.UNSIGNED_INT_24_8:t[r]!==void 0?t[r]:null}return{convert:a}}const WM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,qM=`
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

}`;class kM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(i,a){if(this.texture===null){const r=new em(i.texture);(i.depthNear!==a.depthNear||i.depthFar!==a.depthFar)&&(this.depthNear=i.depthNear,this.depthFar=i.depthFar),this.texture=r}}getMesh(i){if(this.texture!==null&&this.mesh===null){const a=i.cameras[0].viewport,r=new rn({vertexShader:WM,fragmentShader:qM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:a.z},depthHeight:{value:a.w}}});this.mesh=new gi(new ll(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class YM extends pl{constructor(i,a){super();const r=this;let o=null,c=1,u=null,d="local-floor",p=1,g=null,E=null,_=null,v=null,S=null,U=null;const w=typeof XRWebGLBinding<"u",T=new kM,m={},x=a.getContextAttributes();let R=null,b=null;const P=[],N=[],O=new Ye;let I=null;const y=new Ws;y.viewport=new An;const M=new Ws;M.viewport=new An;const L=[y,M],F=new Hg;let W=null,Q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(oe){let ue=P[oe];return ue===void 0&&(ue=new zc,P[oe]=ue),ue.getTargetRaySpace()},this.getControllerGrip=function(oe){let ue=P[oe];return ue===void 0&&(ue=new zc,P[oe]=ue),ue.getGripSpace()},this.getHand=function(oe){let ue=P[oe];return ue===void 0&&(ue=new zc,P[oe]=ue),ue.getHandSpace()};function te(oe){const ue=N.indexOf(oe.inputSource);if(ue===-1)return;const Ue=P[ue];Ue!==void 0&&(Ue.update(oe.inputSource,oe.frame,g||u),Ue.dispatchEvent({type:oe.type,data:oe.inputSource}))}function G(){o.removeEventListener("select",te),o.removeEventListener("selectstart",te),o.removeEventListener("selectend",te),o.removeEventListener("squeeze",te),o.removeEventListener("squeezestart",te),o.removeEventListener("squeezeend",te),o.removeEventListener("end",G),o.removeEventListener("inputsourceschange",ne);for(let oe=0;oe<P.length;oe++){const ue=N[oe];ue!==null&&(N[oe]=null,P[oe].disconnect(ue))}W=null,Q=null,T.reset();for(const oe in m)delete m[oe];i.setRenderTarget(R),S=null,v=null,_=null,o=null,b=null,lt.stop(),r.isPresenting=!1,i.setPixelRatio(I),i.setSize(O.width,O.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(oe){c=oe,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(oe){d=oe,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return g||u},this.setReferenceSpace=function(oe){g=oe},this.getBaseLayer=function(){return v!==null?v:S},this.getBinding=function(){return _===null&&w&&(_=new XRWebGLBinding(o,a)),_},this.getFrame=function(){return U},this.getSession=function(){return o},this.setSession=async function(oe){if(o=oe,o!==null){if(R=i.getRenderTarget(),o.addEventListener("select",te),o.addEventListener("selectstart",te),o.addEventListener("selectend",te),o.addEventListener("squeeze",te),o.addEventListener("squeezestart",te),o.addEventListener("squeezeend",te),o.addEventListener("end",G),o.addEventListener("inputsourceschange",ne),x.xrCompatible!==!0&&await a.makeXRCompatible(),I=i.getPixelRatio(),i.getSize(O),w&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ue=null,Ze=null,He=null;x.depth&&(He=x.stencil?a.DEPTH24_STENCIL8:a.DEPTH_COMPONENT24,Ue=x.stencil?kr:Vu,Ze=x.stencil?Ys:Ks);const st={colorFormat:a.RGBA8,depthFormat:He,scaleFactor:c};_=this.getBinding(),v=_.createProjectionLayer(st),o.updateRenderState({layers:[v]}),i.setPixelRatio(1),i.setSize(v.textureWidth,v.textureHeight,!1),b=new $t(v.textureWidth,v.textureHeight,{format:bn,type:Cn,depthTexture:new Xu(v.textureWidth,v.textureHeight,Ze,void 0,void 0,void 0,void 0,void 0,void 0,Ue),stencilBuffer:x.stencil,colorSpace:i.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:v.ignoreDepthValues===!1,resolveStencilBuffer:v.ignoreDepthValues===!1})}else{const Ue={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:c};S=new XRWebGLLayer(o,a,Ue),o.updateRenderState({baseLayer:S}),i.setPixelRatio(1),i.setSize(S.framebufferWidth,S.framebufferHeight,!1),b=new $t(S.framebufferWidth,S.framebufferHeight,{format:bn,type:Cn,colorSpace:i.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:S.ignoreDepthValues===!1,resolveStencilBuffer:S.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(p),g=null,u=await o.requestReferenceSpace(d),lt.setContext(o),lt.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode},this.getDepthTexture=function(){return T.getDepthTexture()};function ne(oe){for(let ue=0;ue<oe.removed.length;ue++){const Ue=oe.removed[ue],Ze=N.indexOf(Ue);Ze>=0&&(N[Ze]=null,P[Ze].disconnect(Ue))}for(let ue=0;ue<oe.added.length;ue++){const Ue=oe.added[ue];let Ze=N.indexOf(Ue);if(Ze===-1){for(let st=0;st<P.length;st++)if(st>=N.length){N.push(Ue),Ze=st;break}else if(N[st]===null){N[st]=Ue,Ze=st;break}if(Ze===-1)break}const He=P[Ze];He&&He.connect(Ue)}}const K=new le,de=new le;function xe(oe,ue,Ue){K.setFromMatrixPosition(ue.matrixWorld),de.setFromMatrixPosition(Ue.matrixWorld);const Ze=K.distanceTo(de),He=ue.projectionMatrix.elements,st=Ue.projectionMatrix.elements,Kt=He[14]/(He[10]-1),H=He[14]/(He[10]+1),Ct=(He[9]+1)/He[5],Je=(He[9]-1)/He[5],qe=(He[8]-1)/He[0],De=(st[8]+1)/st[0],Lt=Kt*qe,Ne=Kt*De,ke=Ze/(-qe+De),Ft=ke*-qe;if(ue.matrixWorld.decompose(oe.position,oe.quaternion,oe.scale),oe.translateX(Ft),oe.translateZ(ke),oe.matrixWorld.compose(oe.position,oe.quaternion,oe.scale),oe.matrixWorldInverse.copy(oe.matrixWorld).invert(),He[10]===-1)oe.projectionMatrix.copy(ue.projectionMatrix),oe.projectionMatrixInverse.copy(ue.projectionMatrixInverse);else{const kt=Kt+ke,B=H+ke,A=Lt-Ft,j=Ne+(Ze-Ft),se=Ct*H/B*kt,fe=Je*H/B*kt;oe.projectionMatrix.makePerspective(A,j,se,fe,kt,B),oe.projectionMatrixInverse.copy(oe.projectionMatrix).invert()}}function Qe(oe,ue){ue===null?oe.matrixWorld.copy(oe.matrix):oe.matrixWorld.multiplyMatrices(ue.matrixWorld,oe.matrix),oe.matrixWorldInverse.copy(oe.matrixWorld).invert()}this.updateCamera=function(oe){if(o===null)return;let ue=oe.near,Ue=oe.far;T.texture!==null&&(T.depthNear>0&&(ue=T.depthNear),T.depthFar>0&&(Ue=T.depthFar)),F.near=M.near=y.near=ue,F.far=M.far=y.far=Ue,(W!==F.near||Q!==F.far)&&(o.updateRenderState({depthNear:F.near,depthFar:F.far}),W=F.near,Q=F.far),F.layers.mask=oe.layers.mask|6,y.layers.mask=F.layers.mask&3,M.layers.mask=F.layers.mask&5;const Ze=oe.parent,He=F.cameras;Qe(F,Ze);for(let st=0;st<He.length;st++)Qe(He[st],Ze);He.length===2?xe(F,y,M):F.projectionMatrix.copy(y.projectionMatrix),ot(oe,F,Ze)};function ot(oe,ue,Ue){Ue===null?oe.matrix.copy(ue.matrixWorld):(oe.matrix.copy(Ue.matrixWorld),oe.matrix.invert(),oe.matrix.multiply(ue.matrixWorld)),oe.matrix.decompose(oe.position,oe.quaternion,oe.scale),oe.updateMatrixWorld(!0),oe.projectionMatrix.copy(ue.projectionMatrix),oe.projectionMatrixInverse.copy(ue.projectionMatrixInverse),oe.isPerspectiveCamera&&(oe.fov=zg*2*Math.atan(1/oe.projectionMatrix.elements[5]),oe.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(v===null&&S===null))return p},this.setFoveation=function(oe){p=oe,v!==null&&(v.fixedFoveation=oe),S!==null&&S.fixedFoveation!==void 0&&(S.fixedFoveation=oe)},this.hasDepthSensing=function(){return T.texture!==null},this.getDepthSensingMesh=function(){return T.getMesh(F)},this.getCameraTexture=function(oe){return m[oe]};let Ut=null;function mt(oe,ue){if(E=ue.getViewerPose(g||u),U=ue,E!==null){const Ue=E.views;S!==null&&(i.setRenderTargetFramebuffer(b,S.framebuffer),i.setRenderTarget(b));let Ze=!1;Ue.length!==F.cameras.length&&(F.cameras.length=0,Ze=!0);for(let H=0;H<Ue.length;H++){const Ct=Ue[H];let Je=null;if(S!==null)Je=S.getViewport(Ct);else{const De=_.getViewSubImage(v,Ct);Je=De.viewport,H===0&&(i.setRenderTargetTextures(b,De.colorTexture,De.depthStencilTexture),i.setRenderTarget(b))}let qe=L[H];qe===void 0&&(qe=new Ws,qe.layers.enable(H),qe.viewport=new An,L[H]=qe),qe.matrix.fromArray(Ct.transform.matrix),qe.matrix.decompose(qe.position,qe.quaternion,qe.scale),qe.projectionMatrix.fromArray(Ct.projectionMatrix),qe.projectionMatrixInverse.copy(qe.projectionMatrix).invert(),qe.viewport.set(Je.x,Je.y,Je.width,Je.height),H===0&&(F.matrix.copy(qe.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Ze===!0&&F.cameras.push(qe)}const He=o.enabledFeatures;if(He&&He.includes("depth-sensing")&&o.depthUsage=="gpu-optimized"&&w){_=r.getBinding();const H=_.getDepthInformation(Ue[0]);H&&H.isValid&&H.texture&&T.init(H,o.renderState)}if(He&&He.includes("camera-access")&&w){i.state.unbindTexture(),_=r.getBinding();for(let H=0;H<Ue.length;H++){const Ct=Ue[H].camera;if(Ct){let Je=m[Ct];Je||(Je=new em,m[Ct]=Je);const qe=_.getCameraImage(Ct);Je.sourceTexture=qe}}}}for(let Ue=0;Ue<P.length;Ue++){const Ze=N[Ue],He=P[Ue];Ze!==null&&He!==void 0&&He.update(Ze,ue,g||u)}Ut&&Ut(oe,ue),ue.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:ue}),U=null}const lt=new pm;lt.setAnimationLoop(mt),this.setAnimationLoop=function(oe){Ut=oe},this.dispose=function(){}}}const es=new cm,KM=new Bn;function QM(t,i){function a(T,m){T.matrixAutoUpdate===!0&&T.updateMatrix(),m.value.copy(T.matrix)}function r(T,m){m.color.getRGB(T.fogColor.value,om(t)),m.isFog?(T.fogNear.value=m.near,T.fogFar.value=m.far):m.isFogExp2&&(T.fogDensity.value=m.density)}function o(T,m,x,R,b){m.isMeshBasicMaterial||m.isMeshLambertMaterial?c(T,m):m.isMeshToonMaterial?(c(T,m),_(T,m)):m.isMeshPhongMaterial?(c(T,m),E(T,m)):m.isMeshStandardMaterial?(c(T,m),v(T,m),m.isMeshPhysicalMaterial&&S(T,m,b)):m.isMeshMatcapMaterial?(c(T,m),U(T,m)):m.isMeshDepthMaterial?c(T,m):m.isMeshDistanceMaterial?(c(T,m),w(T,m)):m.isMeshNormalMaterial?c(T,m):m.isLineBasicMaterial?(u(T,m),m.isLineDashedMaterial&&d(T,m)):m.isPointsMaterial?p(T,m,x,R):m.isSpriteMaterial?g(T,m):m.isShadowMaterial?(T.color.value.copy(m.color),T.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function c(T,m){T.opacity.value=m.opacity,m.color&&T.diffuse.value.copy(m.color),m.emissive&&T.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(T.map.value=m.map,a(m.map,T.mapTransform)),m.alphaMap&&(T.alphaMap.value=m.alphaMap,a(m.alphaMap,T.alphaMapTransform)),m.bumpMap&&(T.bumpMap.value=m.bumpMap,a(m.bumpMap,T.bumpMapTransform),T.bumpScale.value=m.bumpScale,m.side===gn&&(T.bumpScale.value*=-1)),m.normalMap&&(T.normalMap.value=m.normalMap,a(m.normalMap,T.normalMapTransform),T.normalScale.value.copy(m.normalScale),m.side===gn&&T.normalScale.value.negate()),m.displacementMap&&(T.displacementMap.value=m.displacementMap,a(m.displacementMap,T.displacementMapTransform),T.displacementScale.value=m.displacementScale,T.displacementBias.value=m.displacementBias),m.emissiveMap&&(T.emissiveMap.value=m.emissiveMap,a(m.emissiveMap,T.emissiveMapTransform)),m.specularMap&&(T.specularMap.value=m.specularMap,a(m.specularMap,T.specularMapTransform)),m.alphaTest>0&&(T.alphaTest.value=m.alphaTest);const x=i.get(m),R=x.envMap,b=x.envMapRotation;R&&(T.envMap.value=R,es.copy(b),es.x*=-1,es.y*=-1,es.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(es.y*=-1,es.z*=-1),T.envMapRotation.value.setFromMatrix4(KM.makeRotationFromEuler(es)),T.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,T.reflectivity.value=m.reflectivity,T.ior.value=m.ior,T.refractionRatio.value=m.refractionRatio),m.lightMap&&(T.lightMap.value=m.lightMap,T.lightMapIntensity.value=m.lightMapIntensity,a(m.lightMap,T.lightMapTransform)),m.aoMap&&(T.aoMap.value=m.aoMap,T.aoMapIntensity.value=m.aoMapIntensity,a(m.aoMap,T.aoMapTransform))}function u(T,m){T.diffuse.value.copy(m.color),T.opacity.value=m.opacity,m.map&&(T.map.value=m.map,a(m.map,T.mapTransform))}function d(T,m){T.dashSize.value=m.dashSize,T.totalSize.value=m.dashSize+m.gapSize,T.scale.value=m.scale}function p(T,m,x,R){T.diffuse.value.copy(m.color),T.opacity.value=m.opacity,T.size.value=m.size*x,T.scale.value=R*.5,m.map&&(T.map.value=m.map,a(m.map,T.uvTransform)),m.alphaMap&&(T.alphaMap.value=m.alphaMap,a(m.alphaMap,T.alphaMapTransform)),m.alphaTest>0&&(T.alphaTest.value=m.alphaTest)}function g(T,m){T.diffuse.value.copy(m.color),T.opacity.value=m.opacity,T.rotation.value=m.rotation,m.map&&(T.map.value=m.map,a(m.map,T.mapTransform)),m.alphaMap&&(T.alphaMap.value=m.alphaMap,a(m.alphaMap,T.alphaMapTransform)),m.alphaTest>0&&(T.alphaTest.value=m.alphaTest)}function E(T,m){T.specular.value.copy(m.specular),T.shininess.value=Math.max(m.shininess,1e-4)}function _(T,m){m.gradientMap&&(T.gradientMap.value=m.gradientMap)}function v(T,m){T.metalness.value=m.metalness,m.metalnessMap&&(T.metalnessMap.value=m.metalnessMap,a(m.metalnessMap,T.metalnessMapTransform)),T.roughness.value=m.roughness,m.roughnessMap&&(T.roughnessMap.value=m.roughnessMap,a(m.roughnessMap,T.roughnessMapTransform)),m.envMap&&(T.envMapIntensity.value=m.envMapIntensity)}function S(T,m,x){T.ior.value=m.ior,m.sheen>0&&(T.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),T.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(T.sheenColorMap.value=m.sheenColorMap,a(m.sheenColorMap,T.sheenColorMapTransform)),m.sheenRoughnessMap&&(T.sheenRoughnessMap.value=m.sheenRoughnessMap,a(m.sheenRoughnessMap,T.sheenRoughnessMapTransform))),m.clearcoat>0&&(T.clearcoat.value=m.clearcoat,T.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(T.clearcoatMap.value=m.clearcoatMap,a(m.clearcoatMap,T.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(T.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,a(m.clearcoatRoughnessMap,T.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(T.clearcoatNormalMap.value=m.clearcoatNormalMap,a(m.clearcoatNormalMap,T.clearcoatNormalMapTransform),T.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===gn&&T.clearcoatNormalScale.value.negate())),m.dispersion>0&&(T.dispersion.value=m.dispersion),m.iridescence>0&&(T.iridescence.value=m.iridescence,T.iridescenceIOR.value=m.iridescenceIOR,T.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],T.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(T.iridescenceMap.value=m.iridescenceMap,a(m.iridescenceMap,T.iridescenceMapTransform)),m.iridescenceThicknessMap&&(T.iridescenceThicknessMap.value=m.iridescenceThicknessMap,a(m.iridescenceThicknessMap,T.iridescenceThicknessMapTransform))),m.transmission>0&&(T.transmission.value=m.transmission,T.transmissionSamplerMap.value=x.texture,T.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(T.transmissionMap.value=m.transmissionMap,a(m.transmissionMap,T.transmissionMapTransform)),T.thickness.value=m.thickness,m.thicknessMap&&(T.thicknessMap.value=m.thicknessMap,a(m.thicknessMap,T.thicknessMapTransform)),T.attenuationDistance.value=m.attenuationDistance,T.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(T.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(T.anisotropyMap.value=m.anisotropyMap,a(m.anisotropyMap,T.anisotropyMapTransform))),T.specularIntensity.value=m.specularIntensity,T.specularColor.value.copy(m.specularColor),m.specularColorMap&&(T.specularColorMap.value=m.specularColorMap,a(m.specularColorMap,T.specularColorMapTransform)),m.specularIntensityMap&&(T.specularIntensityMap.value=m.specularIntensityMap,a(m.specularIntensityMap,T.specularIntensityMapTransform))}function U(T,m){m.matcap&&(T.matcap.value=m.matcap)}function w(T,m){const x=i.get(m).light;T.referencePosition.value.setFromMatrixPosition(x.matrixWorld),T.nearDistance.value=x.shadow.camera.near,T.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:o}}function ZM(t,i,a,r){let o={},c={},u=[];const d=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function p(x,R){const b=R.program;r.uniformBlockBinding(x,b)}function g(x,R){let b=o[x.id];b===void 0&&(U(x),b=E(x),o[x.id]=b,x.addEventListener("dispose",T));const P=R.program;r.updateUBOMapping(x,P);const N=i.render.frame;c[x.id]!==N&&(v(x),c[x.id]=N)}function E(x){const R=_();x.__bindingPointIndex=R;const b=t.createBuffer(),P=x.__size,N=x.usage;return t.bindBuffer(t.UNIFORM_BUFFER,b),t.bufferData(t.UNIFORM_BUFFER,P,N),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,R,b),b}function _(){for(let x=0;x<d;x++)if(u.indexOf(x)===-1)return u.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function v(x){const R=o[x.id],b=x.uniforms,P=x.__cache;t.bindBuffer(t.UNIFORM_BUFFER,R);for(let N=0,O=b.length;N<O;N++){const I=Array.isArray(b[N])?b[N]:[b[N]];for(let y=0,M=I.length;y<M;y++){const L=I[y];if(S(L,N,y,P)===!0){const F=L.__offset,W=Array.isArray(L.value)?L.value:[L.value];let Q=0;for(let te=0;te<W.length;te++){const G=W[te],ne=w(G);typeof G=="number"||typeof G=="boolean"?(L.__data[0]=G,t.bufferSubData(t.UNIFORM_BUFFER,F+Q,L.__data)):G.isMatrix3?(L.__data[0]=G.elements[0],L.__data[1]=G.elements[1],L.__data[2]=G.elements[2],L.__data[3]=0,L.__data[4]=G.elements[3],L.__data[5]=G.elements[4],L.__data[6]=G.elements[5],L.__data[7]=0,L.__data[8]=G.elements[6],L.__data[9]=G.elements[7],L.__data[10]=G.elements[8],L.__data[11]=0):(G.toArray(L.__data,Q),Q+=ne.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,F,L.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function S(x,R,b,P){const N=x.value,O=R+"_"+b;if(P[O]===void 0)return typeof N=="number"||typeof N=="boolean"?P[O]=N:P[O]=N.clone(),!0;{const I=P[O];if(typeof N=="number"||typeof N=="boolean"){if(I!==N)return P[O]=N,!0}else if(I.equals(N)===!1)return I.copy(N),!0}return!1}function U(x){const R=x.uniforms;let b=0;const P=16;for(let O=0,I=R.length;O<I;O++){const y=Array.isArray(R[O])?R[O]:[R[O]];for(let M=0,L=y.length;M<L;M++){const F=y[M],W=Array.isArray(F.value)?F.value:[F.value];for(let Q=0,te=W.length;Q<te;Q++){const G=W[Q],ne=w(G),K=b%P,de=K%ne.boundary,xe=K+de;b+=de,xe!==0&&P-xe<ne.storage&&(b+=P-xe),F.__data=new Float32Array(ne.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=b,b+=ne.storage}}}const N=b%P;return N>0&&(b+=P-N),x.__size=b,x.__cache={},this}function w(x){const R={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(R.boundary=4,R.storage=4):x.isVector2?(R.boundary=8,R.storage=8):x.isVector3||x.isColor?(R.boundary=16,R.storage=12):x.isVector4?(R.boundary=16,R.storage=16):x.isMatrix3?(R.boundary=48,R.storage=48):x.isMatrix4?(R.boundary=64,R.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),R}function T(x){const R=x.target;R.removeEventListener("dispose",T);const b=u.indexOf(R.__bindingPointIndex);u.splice(b,1),t.deleteBuffer(o[R.id]),delete o[R.id],delete c[R.id]}function m(){for(const x in o)t.deleteBuffer(o[x]);u=[],o={},c={}}return{bind:p,update:g,dispose:m}}class jM{constructor(i={}){const{canvas:a=Ig(),context:r=null,depth:o=!0,stencil:c=!1,alpha:u=!1,antialias:d=!1,premultipliedAlpha:p=!0,preserveDrawingBuffer:g=!1,powerPreference:E="default",failIfMajorPerformanceCaveat:_=!1,reversedDepthBuffer:v=!1}=i;this.isWebGLRenderer=!0;let S;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");S=r.getContextAttributes().alpha}else S=u;const U=new Uint32Array(4),w=new Int32Array(4);let T=null,m=null;const x=[],R=[];this.domElement=a,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=sa,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let P=!1;this._outputColorSpace=vn;let N=0,O=0,I=null,y=-1,M=null;const L=new An,F=new An;let W=null;const Q=new at(0);let te=0,G=a.width,ne=a.height,K=1,de=null,xe=null;const Qe=new An(0,0,G,ne),ot=new An(0,0,G,ne);let Ut=!1;const mt=new Kh;let lt=!1,oe=!1;const ue=new Bn,Ue=new le,Ze=new An,He={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let st=!1;function Kt(){return I===null?K:1}let H=r;function Ct(D,X){return a.getContext(D,X)}try{const D={alpha:!0,depth:o,stencil:c,antialias:d,premultipliedAlpha:p,preserveDrawingBuffer:g,powerPreference:E,failIfMajorPerformanceCaveat:_};if("setAttribute"in a&&a.setAttribute("data-engine",`three.js r${Gu}`),a.addEventListener("webglcontextlost",Ee,!1),a.addEventListener("webglcontextrestored",we,!1),a.addEventListener("webglcontextcreationerror",he,!1),H===null){const X="webgl2";if(H=Ct(X,D),H===null)throw Ct(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(D){throw console.error("THREE.WebGLRenderer: "+D.message),D}let Je,qe,De,Lt,Ne,ke,Ft,kt,B,A,j,se,fe,ae,Fe,Se,Be,Oe,pe,Me,Ve,Ie,ye,$e;function V(){Je=new oT(H),Je.init(),Ie=new XM(H,Je),qe=new eT(H,Je,i,Ie),De=new GM(H,Je),qe.reversedDepthBuffer&&v&&De.buffers.depth.setReversed(!0),Lt=new uT(H),Ne=new UM,ke=new VM(H,Je,De,Ne,qe,Ie,Lt),Ft=new nT(b),kt=new rT(b),B=new vS(H),ye=new JE(H,B),A=new lT(H,B,Lt,ye),j=new dT(H,A,B,Lt),pe=new fT(H,qe,ke),Se=new tT(Ne),se=new bM(b,Ft,kt,Je,qe,ye,Se),fe=new QM(b,Ne),ae=new DM,Fe=new OM(Je),Oe=new jE(b,Ft,kt,De,j,S,p),Be=new HM(b,j,qe),$e=new ZM(H,Lt,qe,De),Me=new $E(H,Je,Lt),Ve=new cT(H,Je,Lt),Lt.programs=se.programs,b.capabilities=qe,b.extensions=Je,b.properties=Ne,b.renderLists=ae,b.shadowMap=Be,b.state=De,b.info=Lt}V();const ge=new YM(b,H);this.xr=ge,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const D=Je.get("WEBGL_lose_context");D&&D.loseContext()},this.forceContextRestore=function(){const D=Je.get("WEBGL_lose_context");D&&D.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(D){D!==void 0&&(K=D,this.setSize(G,ne,!1))},this.getSize=function(D){return D.set(G,ne)},this.setSize=function(D,X,Z=!0){if(ge.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=D,ne=X,a.width=Math.floor(D*K),a.height=Math.floor(X*K),Z===!0&&(a.style.width=D+"px",a.style.height=X+"px"),this.setViewport(0,0,D,X)},this.getDrawingBufferSize=function(D){return D.set(G*K,ne*K).floor()},this.setDrawingBufferSize=function(D,X,Z){G=D,ne=X,K=Z,a.width=Math.floor(D*Z),a.height=Math.floor(X*Z),this.setViewport(0,0,D,X)},this.getCurrentViewport=function(D){return D.copy(L)},this.getViewport=function(D){return D.copy(Qe)},this.setViewport=function(D,X,Z,$){D.isVector4?Qe.set(D.x,D.y,D.z,D.w):Qe.set(D,X,Z,$),De.viewport(L.copy(Qe).multiplyScalar(K).round())},this.getScissor=function(D){return D.copy(ot)},this.setScissor=function(D,X,Z,$){D.isVector4?ot.set(D.x,D.y,D.z,D.w):ot.set(D,X,Z,$),De.scissor(F.copy(ot).multiplyScalar(K).round())},this.getScissorTest=function(){return Ut},this.setScissorTest=function(D){De.setScissorTest(Ut=D)},this.setOpaqueSort=function(D){de=D},this.setTransparentSort=function(D){xe=D},this.getClearColor=function(D){return D.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor(...arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha(...arguments)},this.clear=function(D=!0,X=!0,Z=!0){let $=0;if(D){let k=!1;if(I!==null){const me=I.texture.format;k=me===sm||me===am||me===nm}if(k){const me=I.texture.type,Te=me===Cn||me===Ks||me===ol||me===Ys||me===Jh||me===$h,Pe=Oe.getClearColor(),Ce=Oe.getClearAlpha(),We=Pe.r,Ke=Pe.g,ze=Pe.b;Te?(U[0]=We,U[1]=Ke,U[2]=ze,U[3]=Ce,H.clearBufferuiv(H.COLOR,0,U)):(w[0]=We,w[1]=Ke,w[2]=ze,w[3]=Ce,H.clearBufferiv(H.COLOR,0,w))}else $|=H.COLOR_BUFFER_BIT}X&&($|=H.DEPTH_BUFFER_BIT),Z&&($|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){a.removeEventListener("webglcontextlost",Ee,!1),a.removeEventListener("webglcontextrestored",we,!1),a.removeEventListener("webglcontextcreationerror",he,!1),Oe.dispose(),ae.dispose(),Fe.dispose(),Ne.dispose(),Ft.dispose(),kt.dispose(),j.dispose(),ye.dispose(),$e.dispose(),se.dispose(),ge.dispose(),ge.removeEventListener("sessionstart",qn),ge.removeEventListener("sessionend",tr),xi.stop()};function Ee(D){D.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function we(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const D=Lt.autoReset,X=Be.enabled,Z=Be.autoUpdate,$=Be.needsUpdate,k=Be.type;V(),Lt.autoReset=D,Be.enabled=X,Be.autoUpdate=Z,Be.needsUpdate=$,Be.type=k}function he(D){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",D.statusMessage)}function ce(D){const X=D.target;X.removeEventListener("dispose",ce),Le(X)}function Le(D){je(D),Ne.remove(D)}function je(D){const X=Ne.get(D).programs;X!==void 0&&(X.forEach(function(Z){se.releaseProgram(Z)}),D.isShaderMaterial&&se.releaseShaderCache(D))}this.renderBufferDirect=function(D,X,Z,$,k,me){X===null&&(X=He);const Te=k.isMesh&&k.matrixWorld.determinant()<0,Pe=ir(D,X,Z,$,k);De.setMaterial($,Te);let Ce=Z.index,We=1;if($.wireframe===!0){if(Ce=A.getWireframeAttribute(Z),Ce===void 0)return;We=2}const Ke=Z.drawRange,ze=Z.attributes.position;let ct=Ke.start*We,Rt=(Ke.start+Ke.count)*We;me!==null&&(ct=Math.max(ct,me.start*We),Rt=Math.min(Rt,(me.start+me.count)*We)),Ce!==null?(ct=Math.max(ct,0),Rt=Math.min(Rt,Ce.count)):ze!=null&&(ct=Math.max(ct,0),Rt=Math.min(Rt,ze.count));const Ht=Rt-ct;if(Ht<0||Ht===1/0)return;ye.setup(k,$,Pe,Z,Ce);let wt,bt=Me;if(Ce!==null&&(wt=B.get(Ce),bt=Ve,bt.setIndex(wt)),k.isMesh)$.wireframe===!0?(De.setLineWidth($.wireframeLinewidth*Kt()),bt.setMode(H.LINES)):bt.setMode(H.TRIANGLES);else if(k.isLine){let Xe=$.linewidth;Xe===void 0&&(Xe=1),De.setLineWidth(Xe*Kt()),k.isLineSegments?bt.setMode(H.LINES):k.isLineLoop?bt.setMode(H.LINE_LOOP):bt.setMode(H.LINE_STRIP)}else k.isPoints?bt.setMode(H.POINTS):k.isSprite&&bt.setMode(H.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)_u("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),bt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Je.get("WEBGL_multi_draw"))bt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Xe=k._multiDrawStarts,zt=k._multiDrawCounts,gt=k._multiDrawCount,_n=Ce?B.get(Ce).bytesPerElement:1,Vi=Ne.get($).currentProgram.getUniforms();for(let pn=0;pn<gt;pn++)Vi.setValue(H,"_gl_DrawID",pn),bt.render(Xe[pn]/_n,zt[pn])}else if(k.isInstancedMesh)bt.renderInstances(ct,Ht,k.count);else if(Z.isInstancedBufferGeometry){const Xe=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,zt=Math.min(Z.instanceCount,Xe);bt.renderInstances(ct,Ht,zt)}else bt.render(ct,Ht)};function Et(D,X,Z){D.transparent===!0&&D.side===Rn&&D.forceSinglePass===!1?(D.side=gn,D.needsUpdate=!0,Gi(D,X,Z),D.side=Pa,D.needsUpdate=!0,Gi(D,X,Z),D.side=Rn):Gi(D,X,Z)}this.compile=function(D,X,Z=null){Z===null&&(Z=D),m=Fe.get(Z),m.init(X),R.push(m),Z.traverseVisible(function(k){k.isLight&&k.layers.test(X.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),D!==Z&&D.traverseVisible(function(k){k.isLight&&k.layers.test(X.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),m.setupLights();const $=new Set;return D.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const me=k.material;if(me)if(Array.isArray(me))for(let Te=0;Te<me.length;Te++){const Pe=me[Te];Et(Pe,Z,k),$.add(Pe)}else Et(me,Z,k),$.add(me)}),m=R.pop(),$},this.compileAsync=function(D,X,Z=null){const $=this.compile(D,X,Z);return new Promise(k=>{function me(){if($.forEach(function(Te){Ne.get(Te).currentProgram.isReady()&&$.delete(Te)}),$.size===0){k(D);return}setTimeout(me,10)}Je.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)})};let vt=null;function si(D){vt&&vt(D)}function qn(){xi.stop()}function tr(){xi.start()}const xi=new pm;xi.setAnimationLoop(si),typeof self<"u"&&xi.setContext(self),this.setAnimationLoop=function(D){vt=D,ge.setAnimationLoop(D),D===null?xi.stop():xi.start()},ge.addEventListener("sessionstart",qn),ge.addEventListener("sessionend",tr),this.render=function(D,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),ge.enabled===!0&&ge.isPresenting===!0&&(ge.cameraAutoUpdate===!0&&ge.updateCamera(X),X=ge.getCamera()),D.isScene===!0&&D.onBeforeRender(b,D,X,I),m=Fe.get(D,R.length),m.init(X),R.push(m),ue.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),mt.setFromProjectionMatrix(ue,fp,X.reversedDepth),oe=this.localClippingEnabled,lt=Se.init(this.clippingPlanes,oe),T=ae.get(D,x.length),T.init(),x.push(T),ge.enabled===!0&&ge.isPresenting===!0){const me=b.xr.getDepthSensingMesh();me!==null&&La(me,X,-1/0,b.sortObjects)}La(D,X,0,b.sortObjects),T.finish(),b.sortObjects===!0&&T.sort(de,xe),st=ge.enabled===!1||ge.isPresenting===!1||ge.hasDepthSensing()===!1,st&&Oe.addToRenderList(T,D),this.info.render.frame++,lt===!0&&Se.beginShadows();const Z=m.state.shadowsArray;Be.render(Z,D,X),lt===!0&&Se.endShadows(),this.info.autoReset===!0&&this.info.reset();const $=T.opaque,k=T.transmissive;if(m.setupLights(),X.isArrayCamera){const me=X.cameras;if(k.length>0)for(let Te=0,Pe=me.length;Te<Pe;Te++){const Ce=me[Te];nr($,k,D,Ce)}st&&Oe.render(D);for(let Te=0,Pe=me.length;Te<Pe;Te++){const Ce=me[Te];Ai(T,D,Ce,Ce.viewport)}}else k.length>0&&nr($,k,D,X),st&&Oe.render(D),Ai(T,D,X);I!==null&&O===0&&(ke.updateMultisampleRenderTarget(I),ke.updateRenderTargetMipmap(I)),D.isScene===!0&&D.onAfterRender(b,D,X),ye.resetDefaultState(),y=-1,M=null,R.pop(),R.length>0?(m=R[R.length-1],lt===!0&&Se.setGlobalState(b.clippingPlanes,m.state.camera)):m=null,x.pop(),x.length>0?T=x[x.length-1]:T=null};function La(D,X,Z,$){if(D.visible===!1)return;if(D.layers.test(X.layers)){if(D.isGroup)Z=D.renderOrder;else if(D.isLOD)D.autoUpdate===!0&&D.update(X);else if(D.isLight)m.pushLight(D),D.castShadow&&m.pushShadow(D);else if(D.isSprite){if(!D.frustumCulled||mt.intersectsSprite(D)){$&&Ze.setFromMatrixPosition(D.matrixWorld).applyMatrix4(ue);const Te=j.update(D),Pe=D.material;Pe.visible&&T.push(D,Te,Pe,Z,Ze.z,null)}}else if((D.isMesh||D.isLine||D.isPoints)&&(!D.frustumCulled||mt.intersectsObject(D))){const Te=j.update(D),Pe=D.material;if($&&(D.boundingSphere!==void 0?(D.boundingSphere===null&&D.computeBoundingSphere(),Ze.copy(D.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),Ze.copy(Te.boundingSphere.center)),Ze.applyMatrix4(D.matrixWorld).applyMatrix4(ue)),Array.isArray(Pe)){const Ce=Te.groups;for(let We=0,Ke=Ce.length;We<Ke;We++){const ze=Ce[We],ct=Pe[ze.materialIndex];ct&&ct.visible&&T.push(D,Te,ct,Z,Ze.z,ze)}}else Pe.visible&&T.push(D,Te,Pe,Z,Ze.z,null)}}const me=D.children;for(let Te=0,Pe=me.length;Te<Pe;Te++)La(me[Te],X,Z,$)}function Ai(D,X,Z,$){const k=D.opaque,me=D.transmissive,Te=D.transparent;m.setupLightsView(Z),lt===!0&&Se.setGlobalState(b.clippingPlanes,Z),$&&De.viewport(L.copy($)),k.length>0&&kn(k,X,Z),me.length>0&&kn(me,X,Z),Te.length>0&&kn(Te,X,Z),De.buffers.depth.setTest(!0),De.buffers.depth.setMask(!0),De.buffers.color.setMask(!0),De.setPolygonOffset(!1)}function nr(D,X,Z,$){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[$.id]===void 0&&(m.state.transmissionRenderTarget[$.id]=new $t(1,1,{generateMipmaps:!0,type:Je.has("EXT_color_buffer_half_float")||Je.has("EXT_color_buffer_float")?Kr:Cn,minFilter:Fr,samples:4,stencilBuffer:c,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nn.workingColorSpace}));const me=m.state.transmissionRenderTarget[$.id],Te=$.viewport||L;me.setSize(Te.z*b.transmissionResolutionScale,Te.w*b.transmissionResolutionScale);const Pe=b.getRenderTarget(),Ce=b.getActiveCubeFace(),We=b.getActiveMipmapLevel();b.setRenderTarget(me),b.getClearColor(Q),te=b.getClearAlpha(),te<1&&b.setClearColor(16777215,.5),b.clear(),st&&Oe.render(Z);const Ke=b.toneMapping;b.toneMapping=sa;const ze=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),m.setupLightsView($),lt===!0&&Se.setGlobalState(b.clippingPlanes,$),kn(D,Z,$),ke.updateMultisampleRenderTarget(me),ke.updateRenderTargetMipmap(me),Je.has("WEBGL_multisampled_render_to_texture")===!1){let ct=!1;for(let Rt=0,Ht=X.length;Rt<Ht;Rt++){const wt=X[Rt],bt=wt.object,Xe=wt.geometry,zt=wt.material,gt=wt.group;if(zt.side===Rn&&bt.layers.test($.layers)){const _n=zt.side;zt.side=gn,zt.needsUpdate=!0,ri(bt,Z,$,Xe,zt,gt),zt.side=_n,zt.needsUpdate=!0,ct=!0}}ct===!0&&(ke.updateMultisampleRenderTarget(me),ke.updateRenderTargetMipmap(me))}b.setRenderTarget(Pe,Ce,We),b.setClearColor(Q,te),ze!==void 0&&($.viewport=ze),b.toneMapping=Ke}function kn(D,X,Z){const $=X.isScene===!0?X.overrideMaterial:null;for(let k=0,me=D.length;k<me;k++){const Te=D[k],Pe=Te.object,Ce=Te.geometry,We=Te.group;let Ke=Te.material;Ke.allowOverride===!0&&$!==null&&(Ke=$),Pe.layers.test(Z.layers)&&ri(Pe,X,Z,Ce,Ke,We)}}function ri(D,X,Z,$,k,me){D.onBeforeRender(b,X,Z,$,k,me),D.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,D.matrixWorld),D.normalMatrix.getNormalMatrix(D.modelViewMatrix),k.onBeforeRender(b,X,Z,$,D,me),k.transparent===!0&&k.side===Rn&&k.forceSinglePass===!1?(k.side=gn,k.needsUpdate=!0,b.renderBufferDirect(Z,X,$,k,D,me),k.side=Pa,k.needsUpdate=!0,b.renderBufferDirect(Z,X,$,k,D,me),k.side=Rn):b.renderBufferDirect(Z,X,$,k,D,me),D.onAfterRender(b,X,Z,$,k,me)}function Gi(D,X,Z){X.isScene!==!0&&(X=He);const $=Ne.get(D),k=m.state.lights,me=m.state.shadowsArray,Te=k.state.version,Pe=se.getParameters(D,k.state,me,X,Z),Ce=se.getProgramCacheKey(Pe);let We=$.programs;$.environment=D.isMeshStandardMaterial?X.environment:null,$.fog=X.fog,$.envMap=(D.isMeshStandardMaterial?kt:Ft).get(D.envMap||$.environment),$.envMapRotation=$.environment!==null&&D.envMap===null?X.environmentRotation:D.envMapRotation,We===void 0&&(D.addEventListener("dispose",ce),We=new Map,$.programs=We);let Ke=We.get(Ce);if(Ke!==void 0){if($.currentProgram===Ke&&$.lightsStateVersion===Te)return ss(D,Pe),Ke}else Pe.uniforms=se.getUniforms(D),D.onBeforeCompile(Pe,b),Ke=se.acquireProgram(Pe,Ce),We.set(Ce,Ke),$.uniforms=Pe.uniforms;const ze=$.uniforms;return(!D.isShaderMaterial&&!D.isRawShaderMaterial||D.clipping===!0)&&(ze.clippingPlanes=Se.uniform),ss(D,Pe),$.needsLights=Zr(D),$.lightsStateVersion=Te,$.needsLights&&(ze.ambientLightColor.value=k.state.ambient,ze.lightProbe.value=k.state.probe,ze.directionalLights.value=k.state.directional,ze.directionalLightShadows.value=k.state.directionalShadow,ze.spotLights.value=k.state.spot,ze.spotLightShadows.value=k.state.spotShadow,ze.rectAreaLights.value=k.state.rectArea,ze.ltc_1.value=k.state.rectAreaLTC1,ze.ltc_2.value=k.state.rectAreaLTC2,ze.pointLights.value=k.state.point,ze.pointLightShadows.value=k.state.pointShadow,ze.hemisphereLights.value=k.state.hemi,ze.directionalShadowMap.value=k.state.directionalShadowMap,ze.directionalShadowMatrix.value=k.state.directionalShadowMatrix,ze.spotShadowMap.value=k.state.spotShadowMap,ze.spotLightMatrix.value=k.state.spotLightMatrix,ze.spotLightMap.value=k.state.spotLightMap,ze.pointShadowMap.value=k.state.pointShadowMap,ze.pointShadowMatrix.value=k.state.pointShadowMatrix),$.currentProgram=Ke,$.uniformsList=null,Ke}function qt(D){if(D.uniformsList===null){const X=D.currentProgram.getUniforms();D.uniformsList=il.seqWithValue(X.seq,D.uniforms)}return D.uniformsList}function ss(D,X){const Z=Ne.get(D);Z.outputColorSpace=X.outputColorSpace,Z.batching=X.batching,Z.batchingColor=X.batchingColor,Z.instancing=X.instancing,Z.instancingColor=X.instancingColor,Z.instancingMorph=X.instancingMorph,Z.skinning=X.skinning,Z.morphTargets=X.morphTargets,Z.morphNormals=X.morphNormals,Z.morphColors=X.morphColors,Z.morphTargetsCount=X.morphTargetsCount,Z.numClippingPlanes=X.numClippingPlanes,Z.numIntersection=X.numClipIntersection,Z.vertexAlphas=X.vertexAlphas,Z.vertexTangents=X.vertexTangents,Z.toneMapping=X.toneMapping}function ir(D,X,Z,$,k){X.isScene!==!0&&(X=He),ke.resetTextureUnits();const me=X.fog,Te=$.isMeshStandardMaterial?X.environment:null,Pe=I===null?b.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:js,Ce=($.isMeshStandardMaterial?kt:Ft).get($.envMap||Te),We=$.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,Ke=!!Z.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),ze=!!Z.morphAttributes.position,ct=!!Z.morphAttributes.normal,Rt=!!Z.morphAttributes.color;let Ht=sa;$.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(Ht=b.toneMapping);const wt=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,bt=wt!==void 0?wt.length:0,Xe=Ne.get($),zt=m.state.lights;if(lt===!0&&(oe===!0||D!==M)){const cn=D===M&&$.id===y;Se.setState($,D,cn)}let gt=!1;$.version===Xe.__version?(Xe.needsLights&&Xe.lightsStateVersion!==zt.state.version||Xe.outputColorSpace!==Pe||k.isBatchedMesh&&Xe.batching===!1||!k.isBatchedMesh&&Xe.batching===!0||k.isBatchedMesh&&Xe.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Xe.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Xe.instancing===!1||!k.isInstancedMesh&&Xe.instancing===!0||k.isSkinnedMesh&&Xe.skinning===!1||!k.isSkinnedMesh&&Xe.skinning===!0||k.isInstancedMesh&&Xe.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Xe.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Xe.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Xe.instancingMorph===!1&&k.morphTexture!==null||Xe.envMap!==Ce||$.fog===!0&&Xe.fog!==me||Xe.numClippingPlanes!==void 0&&(Xe.numClippingPlanes!==Se.numPlanes||Xe.numIntersection!==Se.numIntersection)||Xe.vertexAlphas!==We||Xe.vertexTangents!==Ke||Xe.morphTargets!==ze||Xe.morphNormals!==ct||Xe.morphColors!==Rt||Xe.toneMapping!==Ht||Xe.morphTargetsCount!==bt)&&(gt=!0):(gt=!0,Xe.__version=$.version);let _n=Xe.currentProgram;gt===!0&&(_n=Gi($,X,k));let Vi=!1,pn=!1,la=!1;const Bt=_n.getUniforms(),Dn=Xe.uniforms;if(De.useProgram(_n.program)&&(Vi=!0,pn=!0,la=!0),$.id!==y&&(y=$.id,pn=!0),Vi||M!==D){De.buffers.depth.getReversed()&&D.reversedDepth!==!0&&(D._reversedDepth=!0,D.updateProjectionMatrix()),Bt.setValue(H,"projectionMatrix",D.projectionMatrix),Bt.setValue(H,"viewMatrix",D.matrixWorldInverse);const Sn=Bt.map.cameraPosition;Sn!==void 0&&Sn.setValue(H,Ue.setFromMatrixPosition(D.matrixWorld)),qe.logarithmicDepthBuffer&&Bt.setValue(H,"logDepthBufFC",2/(Math.log(D.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&Bt.setValue(H,"isOrthographic",D.isOrthographicCamera===!0),M!==D&&(M=D,pn=!0,la=!0)}if(k.isSkinnedMesh){Bt.setOptional(H,k,"bindMatrix"),Bt.setOptional(H,k,"bindMatrixInverse");const cn=k.skeleton;cn&&(cn.boneTexture===null&&cn.computeBoneTexture(),Bt.setValue(H,"boneTexture",cn.boneTexture,ke))}k.isBatchedMesh&&(Bt.setOptional(H,k,"batchingTexture"),Bt.setValue(H,"batchingTexture",k._matricesTexture,ke),Bt.setOptional(H,k,"batchingIdTexture"),Bt.setValue(H,"batchingIdTexture",k._indirectTexture,ke),Bt.setOptional(H,k,"batchingColorTexture"),k._colorsTexture!==null&&Bt.setValue(H,"batchingColorTexture",k._colorsTexture,ke));const wn=Z.morphAttributes;if((wn.position!==void 0||wn.normal!==void 0||wn.color!==void 0)&&pe.update(k,Z,_n),(pn||Xe.receiveShadow!==k.receiveShadow)&&(Xe.receiveShadow=k.receiveShadow,Bt.setValue(H,"receiveShadow",k.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(Dn.envMap.value=Ce,Dn.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),$.isMeshStandardMaterial&&$.envMap===null&&X.environment!==null&&(Dn.envMapIntensity.value=X.environmentIntensity),pn&&(Bt.setValue(H,"toneMappingExposure",b.toneMappingExposure),Xe.needsLights&&Qr(Dn,la),me&&$.fog===!0&&fe.refreshFogUniforms(Dn,me),fe.refreshMaterialUniforms(Dn,$,K,ne,m.state.transmissionRenderTarget[D.id]),il.upload(H,qt(Xe),Dn,ke)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(il.upload(H,qt(Xe),Dn,ke),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&Bt.setValue(H,"center",k.center),Bt.setValue(H,"modelViewMatrix",k.modelViewMatrix),Bt.setValue(H,"normalMatrix",k.normalMatrix),Bt.setValue(H,"modelMatrix",k.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const cn=$.uniformsGroups;for(let Sn=0,rs=cn.length;Sn<rs;Sn++){const In=cn[Sn];$e.update(In,_n),$e.bind(In,_n)}}return _n}function Qr(D,X){D.ambientLightColor.needsUpdate=X,D.lightProbe.needsUpdate=X,D.directionalLights.needsUpdate=X,D.directionalLightShadows.needsUpdate=X,D.pointLights.needsUpdate=X,D.pointLightShadows.needsUpdate=X,D.spotLights.needsUpdate=X,D.spotLightShadows.needsUpdate=X,D.rectAreaLights.needsUpdate=X,D.hemisphereLights.needsUpdate=X}function Zr(D){return D.isMeshLambertMaterial||D.isMeshToonMaterial||D.isMeshPhongMaterial||D.isMeshStandardMaterial||D.isShadowMaterial||D.isShaderMaterial&&D.lights===!0}this.getActiveCubeFace=function(){return N},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(D,X,Z){const $=Ne.get(D);$.__autoAllocateDepthBuffer=D.resolveDepthBuffer===!1,$.__autoAllocateDepthBuffer===!1&&($.__useRenderToTexture=!1),Ne.get(D.texture).__webglTexture=X,Ne.get(D.depthTexture).__webglTexture=$.__autoAllocateDepthBuffer?void 0:Z,$.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(D,X){const Z=Ne.get(D);Z.__webglFramebuffer=X,Z.__useDefaultFramebuffer=X===void 0};const _l=H.createFramebuffer();this.setRenderTarget=function(D,X=0,Z=0){I=D,N=X,O=Z;let $=!0,k=null,me=!1,Te=!1;if(D){const Ce=Ne.get(D);if(Ce.__useDefaultFramebuffer!==void 0)De.bindFramebuffer(H.FRAMEBUFFER,null),$=!1;else if(Ce.__webglFramebuffer===void 0)ke.setupRenderTarget(D);else if(Ce.__hasExternalTextures)ke.rebindTextures(D,Ne.get(D.texture).__webglTexture,Ne.get(D.depthTexture).__webglTexture);else if(D.depthBuffer){const ze=D.depthTexture;if(Ce.__boundDepthTexture!==ze){if(ze!==null&&Ne.has(ze)&&(D.width!==ze.image.width||D.height!==ze.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ke.setupDepthRenderbuffer(D)}}const We=D.texture;(We.isData3DTexture||We.isDataArrayTexture||We.isCompressedArrayTexture)&&(Te=!0);const Ke=Ne.get(D).__webglFramebuffer;D.isWebGLCubeRenderTarget?(Array.isArray(Ke[X])?k=Ke[X][Z]:k=Ke[X],me=!0):D.samples>0&&ke.useMultisampledRTT(D)===!1?k=Ne.get(D).__webglMultisampledFramebuffer:Array.isArray(Ke)?k=Ke[Z]:k=Ke,L.copy(D.viewport),F.copy(D.scissor),W=D.scissorTest}else L.copy(Qe).multiplyScalar(K).floor(),F.copy(ot).multiplyScalar(K).floor(),W=Ut;if(Z!==0&&(k=_l),De.bindFramebuffer(H.FRAMEBUFFER,k)&&$&&De.drawBuffers(D,k),De.viewport(L),De.scissor(F),De.setScissorTest(W),me){const Ce=Ne.get(D.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+X,Ce.__webglTexture,Z)}else if(Te){const Ce=X;for(let We=0;We<D.textures.length;We++){const Ke=Ne.get(D.textures[We]);H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0+We,Ke.__webglTexture,Z,Ce)}}else if(D!==null&&Z!==0){const Ce=Ne.get(D.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,Ce.__webglTexture,Z)}y=-1},this.readRenderTargetPixels=function(D,X,Z,$,k,me,Te,Pe=0){if(!(D&&D.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=Ne.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Te!==void 0&&(Ce=Ce[Te]),Ce){De.bindFramebuffer(H.FRAMEBUFFER,Ce);try{const We=D.textures[Pe],Ke=We.format,ze=We.type;if(!qe.textureFormatReadable(Ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!qe.textureTypeReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=D.width-$&&Z>=0&&Z<=D.height-k&&(D.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+Pe),H.readPixels(X,Z,$,k,Ie.convert(Ke),Ie.convert(ze),me))}finally{const We=I!==null?Ne.get(I).__webglFramebuffer:null;De.bindFramebuffer(H.FRAMEBUFFER,We)}}},this.readRenderTargetPixelsAsync=async function(D,X,Z,$,k,me,Te,Pe=0){if(!(D&&D.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=Ne.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Te!==void 0&&(Ce=Ce[Te]),Ce)if(X>=0&&X<=D.width-$&&Z>=0&&Z<=D.height-k){De.bindFramebuffer(H.FRAMEBUFFER,Ce);const We=D.textures[Pe],Ke=We.format,ze=We.type;if(!qe.textureFormatReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!qe.textureTypeReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ct=H.createBuffer();H.bindBuffer(H.PIXEL_PACK_BUFFER,ct),H.bufferData(H.PIXEL_PACK_BUFFER,me.byteLength,H.STREAM_READ),D.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+Pe),H.readPixels(X,Z,$,k,Ie.convert(Ke),Ie.convert(ze),0);const Rt=I!==null?Ne.get(I).__webglFramebuffer:null;De.bindFramebuffer(H.FRAMEBUFFER,Rt);const Ht=H.fenceSync(H.SYNC_GPU_COMMANDS_COMPLETE,0);return H.flush(),await Fg(H,Ht,4),H.bindBuffer(H.PIXEL_PACK_BUFFER,ct),H.getBufferSubData(H.PIXEL_PACK_BUFFER,0,me),H.deleteBuffer(ct),H.deleteSync(Ht),me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(D,X=null,Z=0){const $=Math.pow(2,-Z),k=Math.floor(D.image.width*$),me=Math.floor(D.image.height*$),Te=X!==null?X.x:0,Pe=X!==null?X.y:0;ke.setTexture2D(D,0),H.copyTexSubImage2D(H.TEXTURE_2D,Z,0,0,Te,Pe,k,me),De.unbindTexture()};const ar=H.createFramebuffer(),sr=H.createFramebuffer();this.copyTextureToTexture=function(D,X,Z=null,$=null,k=0,me=null){me===null&&(k!==0?(_u("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),me=k,k=0):me=0);let Te,Pe,Ce,We,Ke,ze,ct,Rt,Ht;const wt=D.isCompressedTexture?D.mipmaps[me]:D.image;if(Z!==null)Te=Z.max.x-Z.min.x,Pe=Z.max.y-Z.min.y,Ce=Z.isBox3?Z.max.z-Z.min.z:1,We=Z.min.x,Ke=Z.min.y,ze=Z.isBox3?Z.min.z:0;else{const wn=Math.pow(2,-k);Te=Math.floor(wt.width*wn),Pe=Math.floor(wt.height*wn),D.isDataArrayTexture?Ce=wt.depth:D.isData3DTexture?Ce=Math.floor(wt.depth*wn):Ce=1,We=0,Ke=0,ze=0}$!==null?(ct=$.x,Rt=$.y,Ht=$.z):(ct=0,Rt=0,Ht=0);const bt=Ie.convert(X.format),Xe=Ie.convert(X.type);let zt;X.isData3DTexture?(ke.setTexture3D(X,0),zt=H.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(ke.setTexture2DArray(X,0),zt=H.TEXTURE_2D_ARRAY):(ke.setTexture2D(X,0),zt=H.TEXTURE_2D),H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,X.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,X.unpackAlignment);const gt=H.getParameter(H.UNPACK_ROW_LENGTH),_n=H.getParameter(H.UNPACK_IMAGE_HEIGHT),Vi=H.getParameter(H.UNPACK_SKIP_PIXELS),pn=H.getParameter(H.UNPACK_SKIP_ROWS),la=H.getParameter(H.UNPACK_SKIP_IMAGES);H.pixelStorei(H.UNPACK_ROW_LENGTH,wt.width),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,wt.height),H.pixelStorei(H.UNPACK_SKIP_PIXELS,We),H.pixelStorei(H.UNPACK_SKIP_ROWS,Ke),H.pixelStorei(H.UNPACK_SKIP_IMAGES,ze);const Bt=D.isDataArrayTexture||D.isData3DTexture,Dn=X.isDataArrayTexture||X.isData3DTexture;if(D.isDepthTexture){const wn=Ne.get(D),cn=Ne.get(X),Sn=Ne.get(wn.__renderTarget),rs=Ne.get(cn.__renderTarget);De.bindFramebuffer(H.READ_FRAMEBUFFER,Sn.__webglFramebuffer),De.bindFramebuffer(H.DRAW_FRAMEBUFFER,rs.__webglFramebuffer);for(let In=0;In<Ce;In++)Bt&&(H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Ne.get(D).__webglTexture,k,ze+In),H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Ne.get(X).__webglTexture,me,Ht+In)),H.blitFramebuffer(We,Ke,Te,Pe,ct,Rt,Te,Pe,H.DEPTH_BUFFER_BIT,H.NEAREST);De.bindFramebuffer(H.READ_FRAMEBUFFER,null),De.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else if(k!==0||D.isRenderTargetTexture||Ne.has(D)){const wn=Ne.get(D),cn=Ne.get(X);De.bindFramebuffer(H.READ_FRAMEBUFFER,ar),De.bindFramebuffer(H.DRAW_FRAMEBUFFER,sr);for(let Sn=0;Sn<Ce;Sn++)Bt?H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,wn.__webglTexture,k,ze+Sn):H.framebufferTexture2D(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,wn.__webglTexture,k),Dn?H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,cn.__webglTexture,me,Ht+Sn):H.framebufferTexture2D(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,cn.__webglTexture,me),k!==0?H.blitFramebuffer(We,Ke,Te,Pe,ct,Rt,Te,Pe,H.COLOR_BUFFER_BIT,H.NEAREST):Dn?H.copyTexSubImage3D(zt,me,ct,Rt,Ht+Sn,We,Ke,Te,Pe):H.copyTexSubImage2D(zt,me,ct,Rt,We,Ke,Te,Pe);De.bindFramebuffer(H.READ_FRAMEBUFFER,null),De.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else Dn?D.isDataTexture||D.isData3DTexture?H.texSubImage3D(zt,me,ct,Rt,Ht,Te,Pe,Ce,bt,Xe,wt.data):X.isCompressedArrayTexture?H.compressedTexSubImage3D(zt,me,ct,Rt,Ht,Te,Pe,Ce,bt,wt.data):H.texSubImage3D(zt,me,ct,Rt,Ht,Te,Pe,Ce,bt,Xe,wt):D.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,me,ct,Rt,Te,Pe,bt,Xe,wt.data):D.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,me,ct,Rt,wt.width,wt.height,bt,wt.data):H.texSubImage2D(H.TEXTURE_2D,me,ct,Rt,Te,Pe,bt,Xe,wt);H.pixelStorei(H.UNPACK_ROW_LENGTH,gt),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,_n),H.pixelStorei(H.UNPACK_SKIP_PIXELS,Vi),H.pixelStorei(H.UNPACK_SKIP_ROWS,pn),H.pixelStorei(H.UNPACK_SKIP_IMAGES,la),me===0&&X.generateMipmaps&&H.generateMipmap(zt),De.unbindTexture()},this.initRenderTarget=function(D){Ne.get(D).__webglFramebuffer===void 0&&ke.setupRenderTarget(D)},this.initTexture=function(D){D.isCubeTexture?ke.setTextureCube(D,0):D.isData3DTexture?ke.setTexture3D(D,0):D.isDataArrayTexture||D.isCompressedArrayTexture?ke.setTexture2DArray(D,0):ke.setTexture2D(D,0),De.unbindTexture()},this.resetState=function(){N=0,O=0,I=null,De.reset(),ye.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return fp}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(i){this._outputColorSpace=i;const a=this.getContext();a.drawingBufferColorSpace=nn._getDrawingBufferColorSpace(i),a.unpackColorSpace=nn._getUnpackColorSpace()}}const JM=()=>{const[t,i]=St.useState(0);return St.useEffect(()=>{const a=()=>{console.warn("[useWebGLContextRecovery] WebGL context lost. Ride will pause and attempt to recover on context restoration.")},r=()=>{console.log("[useWebGLContextRecovery] WebGL context restored. Triggering scene rebuild."),i(o=>o+1)};return window.addEventListener("audiorailrider:webglcontextlost",a),window.addEventListener("audiorailrider:webglcontextrestored",r),()=>{window.removeEventListener("audiorailrider:webglcontextlost",a),window.removeEventListener("audiorailrider:webglcontextrestored",r)}},[]),t};class $M{constructor(i=1e3){ie(this,"frames",0);ie(this,"lastTime",performance.now());ie(this,"lastFps",60);ie(this,"sampleInterval");this.sampleInterval=i}tick(){this.frames++;const i=performance.now(),a=i-this.lastTime;if(a>=this.sampleInterval){const r=this.frames*1e3/a;return this.lastFps=r,this.frames=0,this.lastTime=i,r}return null}getLastFps(){return this.lastFps}}var $c={exports:{}},ea={};/**
 * @license React
 * react-reconciler-constants.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var gh;function ey(){return gh||(gh=1,ea.ConcurrentRoot=1,ea.ContinuousEventPriority=8,ea.DefaultEventPriority=32,ea.DiscreteEventPriority=2,ea.IdleEventPriority=268435456,ea.LegacyRoot=0,ea.NoEventPriority=0),ea}var _h;function ty(){return _h||(_h=1,$c.exports=ey()),$c.exports}ty();var eu={exports:{}},tu={exports:{}},nu={exports:{}},iu={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Sh;function ny(){return Sh||(Sh=1,(function(t){function i(G,ne){var K=G.length;G.push(ne);e:for(;0<K;){var de=K-1>>>1,xe=G[de];if(0<o(xe,ne))G[de]=ne,G[K]=xe,K=de;else break e}}function a(G){return G.length===0?null:G[0]}function r(G){if(G.length===0)return null;var ne=G[0],K=G.pop();if(K!==ne){G[0]=K;e:for(var de=0,xe=G.length,Qe=xe>>>1;de<Qe;){var ot=2*(de+1)-1,Ut=G[ot],mt=ot+1,lt=G[mt];if(0>o(Ut,K))mt<xe&&0>o(lt,Ut)?(G[de]=lt,G[mt]=K,de=mt):(G[de]=Ut,G[ot]=K,de=ot);else if(mt<xe&&0>o(lt,K))G[de]=lt,G[mt]=K,de=mt;else break e}}return ne}function o(G,ne){var K=G.sortIndex-ne.sortIndex;return K!==0?K:G.id-ne.id}if(t.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var c=performance;t.unstable_now=function(){return c.now()}}else{var u=Date,d=u.now();t.unstable_now=function(){return u.now()-d}}var p=[],g=[],E=1,_=null,v=3,S=!1,U=!1,w=!1,T=typeof setTimeout=="function"?setTimeout:null,m=typeof clearTimeout=="function"?clearTimeout:null,x=typeof setImmediate<"u"?setImmediate:null;function R(G){for(var ne=a(g);ne!==null;){if(ne.callback===null)r(g);else if(ne.startTime<=G)r(g),ne.sortIndex=ne.expirationTime,i(p,ne);else break;ne=a(g)}}function b(G){if(w=!1,R(G),!U)if(a(p)!==null)U=!0,Q();else{var ne=a(g);ne!==null&&te(b,ne.startTime-G)}}var P=!1,N=-1,O=5,I=-1;function y(){return!(t.unstable_now()-I<O)}function M(){if(P){var G=t.unstable_now();I=G;var ne=!0;try{e:{U=!1,w&&(w=!1,m(N),N=-1),S=!0;var K=v;try{t:{for(R(G),_=a(p);_!==null&&!(_.expirationTime>G&&y());){var de=_.callback;if(typeof de=="function"){_.callback=null,v=_.priorityLevel;var xe=de(_.expirationTime<=G);if(G=t.unstable_now(),typeof xe=="function"){_.callback=xe,R(G),ne=!0;break t}_===a(p)&&r(p),R(G)}else r(p);_=a(p)}if(_!==null)ne=!0;else{var Qe=a(g);Qe!==null&&te(b,Qe.startTime-G),ne=!1}}break e}finally{_=null,v=K,S=!1}ne=void 0}}finally{ne?L():P=!1}}}var L;if(typeof x=="function")L=function(){x(M)};else if(typeof MessageChannel<"u"){var F=new MessageChannel,W=F.port2;F.port1.onmessage=M,L=function(){W.postMessage(null)}}else L=function(){T(M,0)};function Q(){P||(P=!0,L())}function te(G,ne){N=T(function(){G(t.unstable_now())},ne)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(G){G.callback=null},t.unstable_continueExecution=function(){U||S||(U=!0,Q())},t.unstable_forceFrameRate=function(G){0>G||125<G?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):O=0<G?Math.floor(1e3/G):5},t.unstable_getCurrentPriorityLevel=function(){return v},t.unstable_getFirstCallbackNode=function(){return a(p)},t.unstable_next=function(G){switch(v){case 1:case 2:case 3:var ne=3;break;default:ne=v}var K=v;v=ne;try{return G()}finally{v=K}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(G,ne){switch(G){case 1:case 2:case 3:case 4:case 5:break;default:G=3}var K=v;v=G;try{return ne()}finally{v=K}},t.unstable_scheduleCallback=function(G,ne,K){var de=t.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?de+K:de):K=de,G){case 1:var xe=-1;break;case 2:xe=250;break;case 5:xe=1073741823;break;case 4:xe=1e4;break;default:xe=5e3}return xe=K+xe,G={id:E++,callback:ne,priorityLevel:G,startTime:K,expirationTime:xe,sortIndex:-1},K>de?(G.sortIndex=K,i(g,G),a(p)===null&&G===a(g)&&(w?(m(N),N=-1):w=!0,te(b,K-de))):(G.sortIndex=xe,i(p,G),U||S||(U=!0,Q())),G},t.unstable_shouldYield=y,t.unstable_wrapCallback=function(G){var ne=v;return function(){var K=v;v=ne;try{return G.apply(this,arguments)}finally{v=K}}}})(iu)),iu}var Eh;function _m(){return Eh||(Eh=1,nu.exports=ny()),nu.exports}/**
 * @license React
 * react-reconciler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Th;function iy(){return Th||(Th=1,(function(t){t.exports=function(i){function a(e,n,s,l){return new jm(e,n,s,l)}function r(){}function o(e){var n="https://react.dev/errors/"+e;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var s=2;s<arguments.length;s++)n+="&args[]="+encodeURIComponent(arguments[s])}return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function c(e){return e===null||typeof e!="object"?null:(e=wd&&e[wd]||e["@@iterator"],typeof e=="function"?e:null)}function u(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===iv?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ds:return"Fragment";case fs:return"Portal";case oc:return"Profiler";case Ud:return"StrictMode";case cc:return"Suspense";case uc:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case ha:return(e.displayName||"Context")+".Provider";case Cd:return(e._context.displayName||"Context")+".Consumer";case lc:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case fc:return n=e.displayName||null,n!==null?n:u(e.type)||"Memo";case ma:n=e._payload,e=e._init;try{return u(e(n))}catch{}}return null}function d(e){if(dc===void 0)try{throw Error()}catch(s){var n=s.stack.trim().match(/\n( *(at )?)/);dc=n&&n[1]||"",Pd=-1<s.stack.indexOf(`
    at`)?" (<anonymous>)":-1<s.stack.indexOf("@")?"@unknown:0:0":""}return`
`+dc+e+Pd}function p(e,n){if(!e||pc)return"";pc=!0;var s=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(n){var Re=function(){throw Error()};if(Object.defineProperty(Re.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(Re,[])}catch(nt){var be=nt}Reflect.construct(e,[],Re)}else{try{Re.call()}catch(nt){be=nt}e.call(Re.prototype)}}else{try{throw Error()}catch(nt){be=nt}(Re=e())&&typeof Re.catch=="function"&&Re.catch(function(){})}}catch(nt){if(nt&&be&&typeof nt.stack=="string")return[nt.stack,be.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var f=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");f&&f.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var h=l.DetermineComponentFrameRoot(),C=h[0],z=h[1];if(C&&z){var Y=C.split(`
`),re=z.split(`
`);for(f=l=0;l<Y.length&&!Y[l].includes("DetermineComponentFrameRoot");)l++;for(;f<re.length&&!re[f].includes("DetermineComponentFrameRoot");)f++;if(l===Y.length||f===re.length)for(l=Y.length-1,f=re.length-1;1<=l&&0<=f&&Y[l]!==re[f];)f--;for(;1<=l&&0<=f;l--,f--)if(Y[l]!==re[f]){if(l!==1||f!==1)do if(l--,f--,0>f||Y[l]!==re[f]){var _e=`
`+Y[l].replace(" at new "," at ");return e.displayName&&_e.includes("<anonymous>")&&(_e=_e.replace("<anonymous>",e.displayName)),_e}while(1<=l&&0<=f);break}}}finally{pc=!1,Error.prepareStackTrace=s}return(s=e?e.displayName||e.name:"")?d(s):""}function g(e){switch(e.tag){case 26:case 27:case 5:return d(e.type);case 16:return d("Lazy");case 13:return d("Suspense");case 19:return d("SuspenseList");case 0:case 15:return e=p(e.type,!1),e;case 11:return e=p(e.type.render,!1),e;case 1:return e=p(e.type,!0),e;default:return""}}function E(e){try{var n="";do n+=g(e),e=e.return;while(e);return n}catch(s){return`
Error generating stack: `+s.message+`
`+s.stack}}function _(e){var n=e,s=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do n=e,(n.flags&4098)!==0&&(s=n.return),e=n.return;while(e)}return n.tag===3?s:null}function v(e){if(_(e)!==e)throw Error(o(188))}function S(e){var n=e.alternate;if(!n){if(n=_(e),n===null)throw Error(o(188));return n!==e?null:e}for(var s=e,l=n;;){var f=s.return;if(f===null)break;var h=f.alternate;if(h===null){if(l=f.return,l!==null){s=l;continue}break}if(f.child===h.child){for(h=f.child;h;){if(h===s)return v(f),e;if(h===l)return v(f),n;h=h.sibling}throw Error(o(188))}if(s.return!==l.return)s=f,l=h;else{for(var C=!1,z=f.child;z;){if(z===s){C=!0,s=f,l=h;break}if(z===l){C=!0,l=f,s=h;break}z=z.sibling}if(!C){for(z=h.child;z;){if(z===s){C=!0,s=h,l=f;break}if(z===l){C=!0,l=h,s=f;break}z=z.sibling}if(!C)throw Error(o(189))}}if(s.alternate!==l)throw Error(o(190))}if(s.tag!==3)throw Error(o(188));return s.stateNode.current===s?e:n}function U(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(n=U(e),n!==null)return n;e=e.sibling}return null}function w(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(e.tag!==4&&(n=w(e),n!==null))return n;e=e.sibling}return null}function T(e){return{current:e}}function m(e){0>hs||(e.current=Sc[hs],Sc[hs]=null,hs--)}function x(e,n){hs++,Sc[hs]=e.current,e.current=n}function R(e){return e>>>=0,e===0?32:31-(_g(e)/Sg|0)|0}function b(e){var n=e&42;if(n!==0)return n;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194176;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function P(e,n){var s=e.pendingLanes;if(s===0)return 0;var l=0,f=e.suspendedLanes,h=e.pingedLanes,C=e.warmLanes;e=e.finishedLanes!==0;var z=s&134217727;return z!==0?(s=z&~f,s!==0?l=b(s):(h&=z,h!==0?l=b(h):e||(C=z&~C,C!==0&&(l=b(C))))):(z=s&~f,z!==0?l=b(z):h!==0?l=b(h):e||(C=s&~C,C!==0&&(l=b(C)))),l===0?0:n!==0&&n!==l&&(n&f)===0&&(f=l&-l,C=n&-n,f>=C||f===32&&(C&4194176)!==0)?n:l}function N(e,n){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&n)===0}function O(e,n){switch(e){case 1:case 2:case 4:case 8:return n+250;case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function I(){var e=po;return po<<=1,(po&4194176)===0&&(po=128),e}function y(){var e=ho;return ho<<=1,(ho&62914560)===0&&(ho=4194304),e}function M(e){for(var n=[],s=0;31>s;s++)n.push(e);return n}function L(e,n){e.pendingLanes|=n,n!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function F(e,n,s,l,f,h){var C=e.pendingLanes;e.pendingLanes=s,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=s,e.entangledLanes&=s,e.errorRecoveryDisabledLanes&=s,e.shellSuspendCounter=0;var z=e.entanglements,Y=e.expirationTimes,re=e.hiddenUpdates;for(s=C&~s;0<s;){var _e=31-Jn(s),Re=1<<_e;z[_e]=0,Y[_e]=-1;var be=re[_e];if(be!==null)for(re[_e]=null,_e=0;_e<be.length;_e++){var nt=be[_e];nt!==null&&(nt.lane&=-536870913)}s&=~Re}l!==0&&W(e,l,0),h!==0&&f===0&&e.tag!==0&&(e.suspendedLanes|=h&~(C&~n))}function W(e,n,s){e.pendingLanes|=n,e.suspendedLanes&=~n;var l=31-Jn(n);e.entangledLanes|=n,e.entanglements[l]=e.entanglements[l]|1073741824|s&4194218}function Q(e,n){var s=e.entangledLanes|=n;for(e=e.entanglements;s;){var l=31-Jn(s),f=1<<l;f&n|e[l]&n&&(e[l]|=n),s&=~f}}function te(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function G(e){if($n&&typeof $n.onCommitFiberRoot=="function")try{$n.onCommitFiberRoot(gr,e,void 0,(e.current.flags&128)===128)}catch{}}function ne(e){if(typeof xg=="function"&&Ag(e),$n&&typeof $n.setStrictMode=="function")try{$n.setStrictMode(gr,e)}catch{}}function K(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}function de(e,n){if(typeof e=="object"&&e!==null){var s=ap.get(e);return s!==void 0?s:(n={value:e,source:n,stack:E(n)},ap.set(e,n),n)}return{value:e,source:n,stack:E(n)}}function xe(e,n){vs[gs++]=go,vs[gs++]=vo,vo=e,go=n}function Qe(e,n,s){ci[ui++]=Ki,ci[ui++]=Qi,ci[ui++]=Xa,Xa=e;var l=Ki;e=Qi;var f=32-Jn(l)-1;l&=~(1<<f),s+=1;var h=32-Jn(n)+f;if(30<h){var C=f-f%5;h=(l&(1<<C)-1).toString(32),l>>=C,f-=C,Ki=1<<32-Jn(n)+f|s<<f|l,Qi=h+e}else Ki=1<<h|s<<f|l,Qi=e}function ot(e){e.return!==null&&(xe(e,1),Qe(e,1,0))}function Ut(e){for(;e===vo;)vo=vs[--gs],vs[gs]=null,go=vs[--gs],vs[gs]=null;for(;e===Xa;)Xa=ci[--ui],ci[ui]=null,Qi=ci[--ui],ci[ui]=null,Ki=ci[--ui],ci[ui]=null}function mt(e,n){x(ga,n),x(_r,e),x(mn,null),e=rv(n),m(mn),x(mn,e)}function lt(){m(mn),m(_r),m(ga)}function oe(e){e.memoizedState!==null&&x(_o,e);var n=mn.current,s=ov(n,e.type);n!==s&&(x(_r,e),x(mn,s))}function ue(e){_r.current===e&&(m(mn),m(_r)),_o.current===e&&(m(_o),Yi?Va._currentValue=ps:Va._currentValue2=ps)}function Ue(e){var n=Error(o(418,""));throw H(de(n,e)),Mc}function Ze(e,n){if(!oi)throw Error(o(175));eg(e.stateNode,e.type,e.memoizedProps,n,e)||Ue(e)}function He(e){for(Nn=e.return;Nn;)switch(Nn.tag){case 3:case 27:Pi=!0;return;case 5:case 13:Pi=!1;return;default:Nn=Nn.return}}function st(e){if(!oi||e!==Nn)return!1;if(!Tt)return He(e),Tt=!0,!1;var n=!1;if(Mn?e.tag!==3&&e.tag!==27&&(e.tag!==5||Yd(e.type)&&!fo(e.type,e.memoizedProps))&&(n=!0):e.tag!==3&&(e.tag!==5||Yd(e.type)&&!fo(e.type,e.memoizedProps))&&(n=!0),n&&yn&&Ue(e),He(e),e.tag===13){if(!oi)throw Error(o(316));if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));yn=ig(e)}else yn=Nn?qd(e.stateNode):null;return!0}function Kt(){oi&&(yn=Nn=null,Tt=!1)}function H(e){Ui===null?Ui=[e]:Ui.push(e)}function Ct(){for(var e=_s,n=yc=_s=0;n<e;){var s=fi[n];fi[n++]=null;var l=fi[n];fi[n++]=null;var f=fi[n];fi[n++]=null;var h=fi[n];if(fi[n++]=null,l!==null&&f!==null){var C=l.pending;C===null?f.next=f:(f.next=C.next,C.next=f),l.pending=f}h!==0&&Lt(s,f,h)}}function Je(e,n,s,l){fi[_s++]=e,fi[_s++]=n,fi[_s++]=s,fi[_s++]=l,yc|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function qe(e,n,s,l){return Je(e,n,s,l),Ne(e)}function De(e,n){return Je(e,null,null,n),Ne(e)}function Lt(e,n,s){e.lanes|=s;var l=e.alternate;l!==null&&(l.lanes|=s);for(var f=!1,h=e.return;h!==null;)h.childLanes|=s,l=h.alternate,l!==null&&(l.childLanes|=s),h.tag===22&&(e=h.stateNode,e===null||e._visibility&1||(f=!0)),e=h,h=h.return;f&&n!==null&&e.tag===3&&(h=e.stateNode,f=31-Jn(s),h=h.hiddenUpdates,e=h[f],e===null?h[f]=[n]:e.push(n),n.lane=s|536870912)}function Ne(e){if(50<br)throw br=0,Hc=null,Error(o(185));for(var n=e.return;n!==null;)e=n,n=e.return;return e.tag===3?e.stateNode:null}function ke(e){e!==Ss&&e.next===null&&(Ss===null?So=Ss=e:Ss=Ss.next=e),Eo=!0,xc||(xc=!0,se(kt))}function Ft(e,n){if(!Ac&&Eo){Ac=!0;do for(var s=!1,l=So;l!==null;){if(e!==0){var f=l.pendingLanes;if(f===0)var h=0;else{var C=l.suspendedLanes,z=l.pingedLanes;h=(1<<31-Jn(42|e)+1)-1,h&=f&~(C&~z),h=h&201326677?h&201326677|1:h?h|2:0}h!==0&&(s=!0,j(l,h))}else h=_t,h=P(l,l===Ot?h:0),(h&3)===0||N(l,h)||(s=!0,j(l,h));l=l.next}while(s);Ac=!1}}function kt(){Eo=xc=!1;var e=0;Es!==0&&(mv()&&(e=Es),Es=0);for(var n=bi(),s=null,l=So;l!==null;){var f=l.next,h=B(l,n);h===0?(l.next=null,s===null?So=f:s.next=f,f===null&&(Ss=s)):(s=l,(e!==0||(h&3)!==0)&&(Eo=!0)),l=f}Ft(e)}function B(e,n){for(var s=e.suspendedLanes,l=e.pingedLanes,f=e.expirationTimes,h=e.pendingLanes&-62914561;0<h;){var C=31-Jn(h),z=1<<C,Y=f[C];Y===-1?((z&s)===0||(z&l)!==0)&&(f[C]=O(z,n)):Y<=n&&(e.expiredLanes|=z),h&=~z}if(n=Ot,s=_t,s=P(e,e===n?s:0),l=e.callbackNode,s===0||e===n&&It===2||e.cancelPendingCommit!==null)return l!==null&&l!==null&&Ec(l),e.callbackNode=null,e.callbackPriority=0;if((s&3)===0||N(e,s)){if(n=s&-s,n===e.callbackPriority)return n;switch(l!==null&&Ec(l),te(s)){case 2:case 8:s=Mg;break;case 32:s=Tc;break;case 268435456:s=yg;break;default:s=Tc}return l=A.bind(null,e),s=mo(s,l),e.callbackPriority=n,e.callbackNode=s,n}return l!==null&&l!==null&&Ec(l),e.callbackPriority=2,e.callbackNode=null,2}function A(e,n){var s=e.callbackNode;if(Ha()&&e.callbackNode!==s)return null;var l=_t;return l=P(e,e===Ot?l:0),l===0?null:(od(e,l,n),B(e,bi()),e.callbackNode!=null&&e.callbackNode===s?A.bind(null,e):null)}function j(e,n){if(Ha())return null;od(e,n,!0)}function se(e){Tv?Mv(function(){(Nt&6)!==0?mo(ip,e):e()}):mo(ip,e)}function fe(){return Es===0&&(Es=I()),Es}function ae(e,n){if(Sr===null){var s=Sr=[];Rc=0,Ts=fe(),Ms={status:"pending",value:void 0,then:function(l){s.push(l)}}}return Rc++,n.then(Fe,Fe),n}function Fe(){if(--Rc===0&&Sr!==null){Ms!==null&&(Ms.status="fulfilled");var e=Sr;Sr=null,Ts=0,Ms=null;for(var n=0;n<e.length;n++)(0,e[n])()}}function Se(e,n){var s=[],l={status:"pending",value:null,reason:null,then:function(f){s.push(f)}};return e.then(function(){l.status="fulfilled",l.value=n;for(var f=0;f<s.length;f++)(0,s[f])(n)},function(f){for(l.status="rejected",l.reason=f,f=0;f<s.length;f++)(0,s[f])(void 0)}),l}function Be(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Oe(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function pe(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Me(e,n,s){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(Nt&2)!==0){var f=l.pending;return f===null?n.next=n:(n.next=f.next,f.next=n),l.pending=n,n=Ne(e),Lt(e,null,s),n}return Je(e,l,n,s),Ne(e)}function Ve(e,n,s){if(n=n.updateQueue,n!==null&&(n=n.shared,(s&4194176)!==0)){var l=n.lanes;l&=e.pendingLanes,s|=l,n.lanes=s,Q(e,s)}}function Ie(e,n){var s=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,s===l)){var f=null,h=null;if(s=s.firstBaseUpdate,s!==null){do{var C={lane:s.lane,tag:s.tag,payload:s.payload,callback:null,next:null};h===null?f=h=C:h=h.next=C,s=s.next}while(s!==null);h===null?f=h=n:h=h.next=n}else f=h=n;s={baseState:l.baseState,firstBaseUpdate:f,lastBaseUpdate:h,shared:l.shared,callbacks:l.callbacks},e.updateQueue=s;return}e=s.lastBaseUpdate,e===null?s.firstBaseUpdate=n:e.next=n,s.lastBaseUpdate=n}function ye(){if(bc){var e=Ms;if(e!==null)throw e}}function $e(e,n,s,l){bc=!1;var f=e.updateQueue;_a=!1;var h=f.firstBaseUpdate,C=f.lastBaseUpdate,z=f.shared.pending;if(z!==null){f.shared.pending=null;var Y=z,re=Y.next;Y.next=null,C===null?h=re:C.next=re,C=Y;var _e=e.alternate;_e!==null&&(_e=_e.updateQueue,z=_e.lastBaseUpdate,z!==C&&(z===null?_e.firstBaseUpdate=re:z.next=re,_e.lastBaseUpdate=Y))}if(h!==null){var Re=f.baseState;C=0,_e=re=Y=null,z=h;do{var be=z.lane&-536870913,nt=be!==z.lane;if(nt?(_t&be)===be:(l&be)===be){be!==0&&be===Ts&&(bc=!0),_e!==null&&(_e=_e.next={lane:0,tag:z.tag,payload:z.payload,callback:null,next:null});e:{var hi=e,Ur=z;be=n;var Ja=s;switch(Ur.tag){case 1:if(hi=Ur.payload,typeof hi=="function"){Re=hi.call(Ja,Re,be);break e}Re=hi;break e;case 3:hi.flags=hi.flags&-65537|128;case 0:if(hi=Ur.payload,be=typeof hi=="function"?hi.call(Ja,Re,be):hi,be==null)break e;Re=rc({},Re,be);break e;case 2:_a=!0}}be=z.callback,be!==null&&(e.flags|=64,nt&&(e.flags|=8192),nt=f.callbacks,nt===null?f.callbacks=[be]:nt.push(be))}else nt={lane:be,tag:z.tag,payload:z.payload,callback:z.callback,next:null},_e===null?(re=_e=nt,Y=Re):_e=_e.next=nt,C|=be;if(z=z.next,z===null){if(z=f.shared.pending,z===null)break;nt=z,z=nt.next,nt.next=null,f.lastBaseUpdate=nt,f.shared.pending=null}}while(!0);_e===null&&(Y=Re),f.baseState=Y,f.firstBaseUpdate=re,f.lastBaseUpdate=_e,h===null&&(f.shared.lanes=0),Ta|=C,e.lanes=C,e.memoizedState=Re}}function V(e,n){if(typeof e!="function")throw Error(o(191,e));e.call(n)}function ge(e,n){var s=e.callbacks;if(s!==null)for(e.callbacks=null,e=0;e<s.length;e++)V(s[e],n)}function Ee(e,n){if(ei(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var s=Object.keys(e),l=Object.keys(n);if(s.length!==l.length)return!1;for(l=0;l<s.length;l++){var f=s[l];if(!Rg.call(n,f)||!ei(e[f],n[f]))return!1}return!0}function we(e){return e=e.status,e==="fulfilled"||e==="rejected"}function he(){}function ce(e,n,s){switch(s=e[s],s===void 0?e.push(n):s!==n&&(n.then(he,he),n=s),n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,e===Er?Error(o(483)):e;default:if(typeof n.status=="string")n.then(he,he);else{if(e=Ot,e!==null&&100<e.shellSuspendCounter)throw Error(o(482));e=n,e.status="pending",e.then(function(l){if(n.status==="pending"){var f=n;f.status="fulfilled",f.value=l}},function(l){if(n.status==="pending"){var f=n;f.status="rejected",f.reason=l}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,e===Er?Error(o(483)):e}throw ys=n,Er}}function Le(){if(ys===null)throw Error(o(459));var e=ys;return ys=null,e}function je(e){var n=Tr;return Tr+=1,xs===null&&(xs=[]),ce(xs,e,n)}function Et(e,n){n=n.props.ref,e.ref=n!==void 0?n:null}function vt(e,n){throw n.$$typeof===ev?Error(o(525)):(e=Object.prototype.toString.call(n),Error(o(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)))}function si(e){var n=e._init;return n(e._payload)}function qn(e){function n(J,q){if(e){var ee=J.deletions;ee===null?(J.deletions=[q],J.flags|=16):ee.push(q)}}function s(J,q){if(!e)return null;for(;q!==null;)n(J,q),q=q.sibling;return null}function l(J){for(var q=new Map;J!==null;)J.key!==null?q.set(J.key,J):q.set(J.index,J),J=J.sibling;return q}function f(J,q){return J=pa(J,q),J.index=0,J.sibling=null,J}function h(J,q,ee){return J.index=ee,e?(ee=J.alternate,ee!==null?(ee=ee.index,ee<q?(J.flags|=33554434,q):ee):(J.flags|=33554434,q)):(J.flags|=1048576,q)}function C(J){return e&&J.alternate===null&&(J.flags|=33554434),J}function z(J,q,ee,ve){return q===null||q.tag!==6?(q=ic(ee,J.mode,ve),q.return=J,q):(q=f(q,ee),q.return=J,q)}function Y(J,q,ee,ve){var Ge=ee.type;return Ge===ds?_e(J,q,ee.props.children,ve,ee.key):q!==null&&(q.elementType===Ge||typeof Ge=="object"&&Ge!==null&&Ge.$$typeof===ma&&si(Ge)===q.type)?(q=f(q,ee.props),Et(q,ee),q.return=J,q):(q=lo(ee.type,ee.key,ee.props,null,J.mode,ve),Et(q,ee),q.return=J,q)}function re(J,q,ee,ve){return q===null||q.tag!==4||q.stateNode.containerInfo!==ee.containerInfo||q.stateNode.implementation!==ee.implementation?(q=ac(ee,J.mode,ve),q.return=J,q):(q=f(q,ee.children||[]),q.return=J,q)}function _e(J,q,ee,ve,Ge){return q===null||q.tag!==7?(q=za(ee,J.mode,ve,Ge),q.return=J,q):(q=f(q,ee),q.return=J,q)}function Re(J,q,ee){if(typeof q=="string"&&q!==""||typeof q=="number"||typeof q=="bigint")return q=ic(""+q,J.mode,ee),q.return=J,q;if(typeof q=="object"&&q!==null){switch(q.$$typeof){case co:return ee=lo(q.type,q.key,q.props,null,J.mode,ee),Et(ee,q),ee.return=J,ee;case fs:return q=ac(q,J.mode,ee),q.return=J,q;case ma:var ve=q._init;return q=ve(q._payload),Re(J,q,ee)}if(uo(q)||c(q))return q=za(q,J.mode,ee,null),q.return=J,q;if(typeof q.then=="function")return Re(J,je(q),ee);if(q.$$typeof===ha)return Re(J,no(J,q),ee);vt(J,q)}return null}function be(J,q,ee,ve){var Ge=q!==null?q.key:null;if(typeof ee=="string"&&ee!==""||typeof ee=="number"||typeof ee=="bigint")return Ge!==null?null:z(J,q,""+ee,ve);if(typeof ee=="object"&&ee!==null){switch(ee.$$typeof){case co:return ee.key===Ge?Y(J,q,ee,ve):null;case fs:return ee.key===Ge?re(J,q,ee,ve):null;case ma:return Ge=ee._init,ee=Ge(ee._payload),be(J,q,ee,ve)}if(uo(ee)||c(ee))return Ge!==null?null:_e(J,q,ee,ve,null);if(typeof ee.then=="function")return be(J,q,je(ee),ve);if(ee.$$typeof===ha)return be(J,q,no(J,ee),ve);vt(J,ee)}return null}function nt(J,q,ee,ve,Ge){if(typeof ve=="string"&&ve!==""||typeof ve=="number"||typeof ve=="bigint")return J=J.get(ee)||null,z(q,J,""+ve,Ge);if(typeof ve=="object"&&ve!==null){switch(ve.$$typeof){case co:return J=J.get(ve.key===null?ee:ve.key)||null,Y(q,J,ve,Ge);case fs:return J=J.get(ve.key===null?ee:ve.key)||null,re(q,J,ve,Ge);case ma:var Gt=ve._init;return ve=Gt(ve._payload),nt(J,q,ee,ve,Ge)}if(uo(ve)||c(ve))return J=J.get(ee)||null,_e(q,J,ve,Ge,null);if(typeof ve.then=="function")return nt(J,q,ee,je(ve),Ge);if(ve.$$typeof===ha)return nt(J,q,ee,no(q,ve),Ge);vt(q,ve)}return null}function hi(J,q,ee,ve){for(var Ge=null,Gt=null,et=q,Mt=q=0,dn=null;et!==null&&Mt<ee.length;Mt++){et.index>Mt?(dn=et,et=null):dn=et.sibling;var yt=be(J,et,ee[Mt],ve);if(yt===null){et===null&&(et=dn);break}e&&et&&yt.alternate===null&&n(J,et),q=h(yt,q,Mt),Gt===null?Ge=yt:Gt.sibling=yt,Gt=yt,et=dn}if(Mt===ee.length)return s(J,et),Tt&&xe(J,Mt),Ge;if(et===null){for(;Mt<ee.length;Mt++)et=Re(J,ee[Mt],ve),et!==null&&(q=h(et,q,Mt),Gt===null?Ge=et:Gt.sibling=et,Gt=et);return Tt&&xe(J,Mt),Ge}for(et=l(et);Mt<ee.length;Mt++)dn=nt(et,J,Mt,ee[Mt],ve),dn!==null&&(e&&dn.alternate!==null&&et.delete(dn.key===null?Mt:dn.key),q=h(dn,q,Mt),Gt===null?Ge=dn:Gt.sibling=dn,Gt=dn);return e&&et.forEach(function(ya){return n(J,ya)}),Tt&&xe(J,Mt),Ge}function Ur(J,q,ee,ve){if(ee==null)throw Error(o(151));for(var Ge=null,Gt=null,et=q,Mt=q=0,dn=null,yt=ee.next();et!==null&&!yt.done;Mt++,yt=ee.next()){et.index>Mt?(dn=et,et=null):dn=et.sibling;var ya=be(J,et,yt.value,ve);if(ya===null){et===null&&(et=dn);break}e&&et&&ya.alternate===null&&n(J,et),q=h(ya,q,Mt),Gt===null?Ge=ya:Gt.sibling=ya,Gt=ya,et=dn}if(yt.done)return s(J,et),Tt&&xe(J,Mt),Ge;if(et===null){for(;!yt.done;Mt++,yt=ee.next())yt=Re(J,yt.value,ve),yt!==null&&(q=h(yt,q,Mt),Gt===null?Ge=yt:Gt.sibling=yt,Gt=yt);return Tt&&xe(J,Mt),Ge}for(et=l(et);!yt.done;Mt++,yt=ee.next())yt=nt(et,J,Mt,yt.value,ve),yt!==null&&(e&&yt.alternate!==null&&et.delete(yt.key===null?Mt:yt.key),q=h(yt,q,Mt),Gt===null?Ge=yt:Gt.sibling=yt,Gt=yt);return e&&et.forEach(function(Ng){return n(J,Ng)}),Tt&&xe(J,Mt),Ge}function Ja(J,q,ee,ve){if(typeof ee=="object"&&ee!==null&&ee.type===ds&&ee.key===null&&(ee=ee.props.children),typeof ee=="object"&&ee!==null){switch(ee.$$typeof){case co:e:{for(var Ge=ee.key;q!==null;){if(q.key===Ge){if(Ge=ee.type,Ge===ds){if(q.tag===7){s(J,q.sibling),ve=f(q,ee.props.children),ve.return=J,J=ve;break e}}else if(q.elementType===Ge||typeof Ge=="object"&&Ge!==null&&Ge.$$typeof===ma&&si(Ge)===q.type){s(J,q.sibling),ve=f(q,ee.props),Et(ve,ee),ve.return=J,J=ve;break e}s(J,q);break}else n(J,q);q=q.sibling}ee.type===ds?(ve=za(ee.props.children,J.mode,ve,ee.key),ve.return=J,J=ve):(ve=lo(ee.type,ee.key,ee.props,null,J.mode,ve),Et(ve,ee),ve.return=J,J=ve)}return C(J);case fs:e:{for(Ge=ee.key;q!==null;){if(q.key===Ge)if(q.tag===4&&q.stateNode.containerInfo===ee.containerInfo&&q.stateNode.implementation===ee.implementation){s(J,q.sibling),ve=f(q,ee.children||[]),ve.return=J,J=ve;break e}else{s(J,q);break}else n(J,q);q=q.sibling}ve=ac(ee,J.mode,ve),ve.return=J,J=ve}return C(J);case ma:return Ge=ee._init,ee=Ge(ee._payload),Ja(J,q,ee,ve)}if(uo(ee))return hi(J,q,ee,ve);if(c(ee)){if(Ge=c(ee),typeof Ge!="function")throw Error(o(150));return ee=Ge.call(ee),Ur(J,q,ee,ve)}if(typeof ee.then=="function")return Ja(J,q,je(ee),ve);if(ee.$$typeof===ha)return Ja(J,q,no(J,ee),ve);vt(J,ee)}return typeof ee=="string"&&ee!==""||typeof ee=="number"||typeof ee=="bigint"?(ee=""+ee,q!==null&&q.tag===6?(s(J,q.sibling),ve=f(q,ee),ve.return=J,J=ve):(s(J,q),ve=ic(ee,J.mode,ve),ve.return=J,J=ve),C(J)):s(J,q)}return function(J,q,ee,ve){try{Tr=0;var Ge=Ja(J,q,ee,ve);return xs=null,Ge}catch(et){if(et===Er)throw et;var Gt=a(29,et,null,J.mode);return Gt.lanes=ve,Gt.return=J,Gt}finally{}}}function tr(e,n){e=$i,x(Mo,e),x(As,n),$i=e|n.baseLanes}function xi(){x(Mo,$i),x(As,As.current)}function La(){$i=Mo.current,m(As),m(Mo)}function Ai(e){var n=e.alternate;x(sn,sn.current&1),x(di,e),Ni===null&&(n===null||As.current!==null||n.memoizedState!==null)&&(Ni=e)}function nr(e){if(e.tag===22){if(x(sn,sn.current),x(di,e),Ni===null){var n=e.alternate;n!==null&&n.memoizedState!==null&&(Ni=e)}}else kn()}function kn(){x(sn,sn.current),x(di,di.current)}function ri(e){m(di),Ni===e&&(Ni=null),m(sn)}function Gi(e){for(var n=e;n!==null;){if(n.tag===13){var s=n.memoizedState;if(s!==null&&(s=s.dehydrated,s===null||vc(s)||gc(s)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!==void 0){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}function qt(){throw Error(o(321))}function ss(e,n){if(n===null)return!1;for(var s=0;s<n.length&&s<e.length;s++)if(!ei(e[s],n[s]))return!1;return!0}function ir(e,n,s,l,f,h){return Sa=h,ut=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,tt.H=e===null||e.memoizedState===null?ka:Ea,qa=!1,h=s(l,f),qa=!1,Rs&&(h=Zr(n,s,l,f)),Qr(e),h}function Qr(e){tt.H=Li;var n=Pt!==null&&Pt.next!==null;if(Sa=0,en=Pt=ut=null,yo=!1,Mr=0,bs=null,n)throw Error(o(300));e===null||un||(e=e.dependencies,e!==null&&to(e)&&(un=!0))}function Zr(e,n,s,l){ut=e;var f=0;do{if(Rs&&(bs=null),Mr=0,Rs=!1,25<=f)throw Error(o(301));if(f+=1,en=Pt=null,e.updateQueue!=null){var h=e.updateQueue;h.lastEffect=null,h.events=null,h.stores=null,h.memoCache!=null&&(h.memoCache.index=0)}tt.H=Ya,h=n(s,l)}while(Rs);return h}function _l(){var e=tt.H,n=e.useState()[0];return n=typeof n.then=="function"?$(n):n,e=e.useState()[0],(Pt!==null?Pt.memoizedState:null)!==e&&(ut.flags|=1024),n}function ar(){var e=xo!==0;return xo=0,e}function sr(e,n,s){n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~s}function D(e){if(yo){for(e=e.memoizedState;e!==null;){var n=e.queue;n!==null&&(n.pending=null),e=e.next}yo=!1}Sa=0,en=Pt=ut=null,Rs=!1,Mr=xo=0,bs=null}function X(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return en===null?ut.memoizedState=en=e:en=en.next=e,en}function Z(){if(Pt===null){var e=ut.alternate;e=e!==null?e.memoizedState:null}else e=Pt.next;var n=en===null?ut.memoizedState:en.next;if(n!==null)en=n,Pt=e;else{if(e===null)throw ut.alternate===null?Error(o(467)):Error(o(310));Pt=e,e={memoizedState:Pt.memoizedState,baseState:Pt.baseState,baseQueue:Pt.baseQueue,queue:Pt.queue,next:null},en===null?ut.memoizedState=en=e:en=en.next=e}return en}function $(e){var n=Mr;return Mr+=1,bs===null&&(bs=[]),e=ce(bs,e,n),n=ut,(en===null?n.memoizedState:en.next)===null&&(n=n.alternate,tt.H=n===null||n.memoizedState===null?ka:Ea),e}function k(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return $(e);if(e.$$typeof===ha)return En(e)}throw Error(o(438,String(e)))}function me(e){var n=null,s=ut.updateQueue;if(s!==null&&(n=s.memoCache),n==null){var l=ut.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(n={data:l.data.map(function(f){return f.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),s===null&&(s=Cc(),ut.updateQueue=s),s.memoCache=n,s=n.data[n.index],s===void 0)for(s=n.data[n.index]=Array(e),l=0;l<e;l++)s[l]=nv;return n.index++,s}function Te(e,n){return typeof n=="function"?n(e):n}function Pe(e){var n=Z();return Ce(n,Pt,e)}function Ce(e,n,s){var l=e.queue;if(l===null)throw Error(o(311));l.lastRenderedReducer=s;var f=e.baseQueue,h=l.pending;if(h!==null){if(f!==null){var C=f.next;f.next=h.next,h.next=C}n.baseQueue=f=h,l.pending=null}if(h=e.baseState,f===null)e.memoizedState=h;else{n=f.next;var z=C=null,Y=null,re=n,_e=!1;do{var Re=re.lane&-536870913;if(Re!==re.lane?(_t&Re)===Re:(Sa&Re)===Re){var be=re.revertLane;if(be===0)Y!==null&&(Y=Y.next={lane:0,revertLane:0,action:re.action,hasEagerState:re.hasEagerState,eagerState:re.eagerState,next:null}),Re===Ts&&(_e=!0);else if((Sa&be)===be){re=re.next,be===Ts&&(_e=!0);continue}else Re={lane:0,revertLane:re.revertLane,action:re.action,hasEagerState:re.hasEagerState,eagerState:re.eagerState,next:null},Y===null?(z=Y=Re,C=h):Y=Y.next=Re,ut.lanes|=be,Ta|=be;Re=re.action,qa&&s(h,Re),h=re.hasEagerState?re.eagerState:s(h,Re)}else be={lane:Re,revertLane:re.revertLane,action:re.action,hasEagerState:re.hasEagerState,eagerState:re.eagerState,next:null},Y===null?(z=Y=be,C=h):Y=Y.next=be,ut.lanes|=Re,Ta|=Re;re=re.next}while(re!==null&&re!==n);if(Y===null?C=h:Y.next=z,!ei(h,e.memoizedState)&&(un=!0,_e&&(s=Ms,s!==null)))throw s;e.memoizedState=h,e.baseState=C,e.baseQueue=Y,l.lastRenderedState=h}return f===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function We(e){var n=Z(),s=n.queue;if(s===null)throw Error(o(311));s.lastRenderedReducer=e;var l=s.dispatch,f=s.pending,h=n.memoizedState;if(f!==null){s.pending=null;var C=f=f.next;do h=e(h,C.action),C=C.next;while(C!==f);ei(h,n.memoizedState)||(un=!0),n.memoizedState=h,n.baseQueue===null&&(n.baseState=h),s.lastRenderedState=h}return[h,l]}function Ke(e,n,s){var l=ut,f=Z(),h=Tt;if(h){if(s===void 0)throw Error(o(407));s=s()}else s=n();var C=!ei((Pt||f).memoizedState,s);if(C&&(f.memoizedState=s,un=!0),f=f.queue,Sl(Rt.bind(null,l,f,e),[e]),f.getSnapshot!==n||C||en!==null&&en.memoizedState.tag&1){if(l.flags|=2048,In(9,ct.bind(null,l,f,s,n),{destroy:void 0},null),Ot===null)throw Error(o(349));h||(Sa&60)!==0||ze(l,n,s)}return s}function ze(e,n,s){e.flags|=16384,e={getSnapshot:n,value:s},n=ut.updateQueue,n===null?(n=Cc(),ut.updateQueue=n,n.stores=[e]):(s=n.stores,s===null?n.stores=[e]:s.push(e))}function ct(e,n,s,l){n.value=s,n.getSnapshot=l,Ht(n)&&wt(e)}function Rt(e,n,s){return s(function(){Ht(n)&&wt(e)})}function Ht(e){var n=e.getSnapshot;e=e.value;try{var s=n();return!ei(e,s)}catch{return!0}}function wt(e){var n=De(e,2);n!==null&&Pn(n,e,2)}function bt(e){var n=X();if(typeof e=="function"){var s=e;if(e=s(),qa){ne(!0);try{s()}finally{ne(!1)}}}return n.memoizedState=n.baseState=e,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Te,lastRenderedState:e},n}function Xe(e,n,s,l){return e.baseState=s,Ce(e,Pt,typeof l=="function"?l:Te)}function zt(e,n,s,l,f){if($r(e))throw Error(o(485));if(e=n.action,e!==null){var h={payload:f,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(C){h.listeners.push(C)}};tt.T!==null?s(!0):h.isTransition=!1,l(h),s=n.pending,s===null?(h.next=n.pending=h,gt(n,h)):(h.next=s.next,n.pending=s.next=h)}}function gt(e,n){var s=n.action,l=n.payload,f=e.state;if(n.isTransition){var h=tt.T,C={};tt.T=C;try{var z=s(f,l),Y=tt.S;Y!==null&&Y(C,z),_n(e,n,z)}catch(re){pn(e,n,re)}finally{tt.T=h}}else try{h=s(f,l),_n(e,n,h)}catch(re){pn(e,n,re)}}function _n(e,n,s){s!==null&&typeof s=="object"&&typeof s.then=="function"?s.then(function(l){Vi(e,n,l)},function(l){return pn(e,n,l)}):Vi(e,n,s)}function Vi(e,n,s){n.status="fulfilled",n.value=s,la(n),e.state=s,n=e.pending,n!==null&&(s=n.next,s===n?e.pending=null:(s=s.next,n.next=s,gt(e,s)))}function pn(e,n,s){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do n.status="rejected",n.reason=s,la(n),n=n.next;while(n!==l)}e.action=null}function la(e){e=e.listeners;for(var n=0;n<e.length;n++)(0,e[n])()}function Bt(e,n){return n}function Dn(e,n){if(Tt){var s=Ot.formState;if(s!==null){e:{var l=ut;if(Tt){if(yn){var f=Yv(yn,Pi);if(f){yn=qd(f),l=Kv(f);break e}}Ue(l)}l=!1}l&&(n=s[0])}}s=X(),s.memoizedState=s.baseState=n,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bt,lastRenderedState:n},s.queue=l,s=vf.bind(null,ut,l),l.dispatch=s,l=bt(!1);var h=yl.bind(null,ut,!1,l.queue);return l=X(),f={state:n,dispatch:null,action:e,pending:null},l.queue=f,s=zt.bind(null,ut,f,h,s),f.dispatch=s,l.memoizedState=e,[n,s,!1]}function wn(e){var n=Z();return cn(n,Pt,e)}function cn(e,n,s){n=Ce(e,n,Bt)[0],e=Pe(Te)[0],n=typeof n=="object"&&n!==null&&typeof n.then=="function"?$(n):n;var l=Z(),f=l.queue,h=f.dispatch;return s!==l.memoizedState&&(ut.flags|=2048,In(9,Sn.bind(null,f,s),{destroy:void 0},null)),[n,h,e]}function Sn(e,n){e.action=n}function rs(e){var n=Z(),s=Pt;if(s!==null)return cn(n,s,e);Z(),n=n.memoizedState,s=Z();var l=s.queue.dispatch;return s.memoizedState=e,[n,l,!1]}function In(e,n,s,l){return e={tag:e,create:n,inst:s,deps:l,next:null},n=ut.updateQueue,n===null&&(n=Cc(),ut.updateQueue=n),s=n.lastEffect,s===null?n.lastEffect=e.next=e:(l=s.next,s.next=e,e.next=l,n.lastEffect=e),e}function nf(){return Z().memoizedState}function jr(e,n,s,l){var f=X();ut.flags|=e,f.memoizedState=In(1|n,s,{destroy:void 0},l===void 0?null:l)}function Jr(e,n,s,l){var f=Z();l=l===void 0?null:l;var h=f.memoizedState.inst;Pt!==null&&l!==null&&ss(l,Pt.memoizedState.deps)?f.memoizedState=In(n,s,h,l):(ut.flags|=e,f.memoizedState=In(1|n,s,h,l))}function af(e,n){jr(8390656,8,e,n)}function Sl(e,n){Jr(2048,8,e,n)}function sf(e,n){return Jr(4,2,e,n)}function rf(e,n){return Jr(4,4,e,n)}function of(e,n){if(typeof n=="function"){e=e();var s=n(e);return function(){typeof s=="function"?s():n(null)}}if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function lf(e,n,s){s=s!=null?s.concat([e]):null,Jr(4,4,of.bind(null,n,e),s)}function El(){}function cf(e,n){var s=Z();n=n===void 0?null:n;var l=s.memoizedState;return n!==null&&ss(n,l[1])?l[0]:(s.memoizedState=[e,n],e)}function uf(e,n){var s=Z();n=n===void 0?null:n;var l=s.memoizedState;if(n!==null&&ss(n,l[1]))return l[0];if(l=e(),qa){ne(!0);try{e()}finally{ne(!1)}}return s.memoizedState=[l,n],l}function Tl(e,n,s){return s===void 0||(Sa&1073741824)!==0?e.memoizedState=n:(e.memoizedState=s,e=rd(),ut.lanes|=e,Ta|=e,s)}function ff(e,n,s,l){return ei(s,n)?s:As.current!==null?(e=Tl(e,s,l),ei(e,n)||(un=!0),e):(Sa&42)===0?(un=!0,e.memoizedState=s):(e=rd(),ut.lanes|=e,Ta|=e,n)}function df(e,n,s,l,f){var h=Ga();Hn(h!==0&&8>h?h:8);var C=tt.T,z={};tt.T=z,yl(e,!1,n,s);try{var Y=f(),re=tt.S;if(re!==null&&re(z,Y),Y!==null&&typeof Y=="object"&&typeof Y.then=="function"){var _e=Se(Y,l);rr(e,n,_e,Zn(e))}else rr(e,n,l,Zn(e))}catch(Re){rr(e,n,{then:function(){},status:"rejected",reason:Re},Zn())}finally{Hn(h),tt.T=C}}function pf(e){var n=e.memoizedState;if(n!==null)return n;n={memoizedState:ps,baseState:ps,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Te,lastRenderedState:ps},next:null};var s={};return n.next={memoizedState:s,baseState:s,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Te,lastRenderedState:s},next:null},e.memoizedState=n,e=e.alternate,e!==null&&(e.memoizedState=n),n}function Ml(){return En(Va)}function hf(){return Z().memoizedState}function mf(){return Z().memoizedState}function Lm(e){for(var n=e.return;n!==null;){switch(n.tag){case 24:case 3:var s=Zn();e=pe(s);var l=Me(n,e,s);l!==null&&(Pn(l,n,s),Ve(l,n,s)),n={cache:Ol()},e.payload=n;return}n=n.return}}function Bm(e,n,s){var l=Zn();s={lane:l,revertLane:0,action:s,hasEagerState:!1,eagerState:null,next:null},$r(e)?gf(n,s):(s=qe(e,n,s,l),s!==null&&(Pn(s,e,l),_f(s,n,l)))}function vf(e,n,s){var l=Zn();rr(e,n,s,l)}function rr(e,n,s,l){var f={lane:l,revertLane:0,action:s,hasEagerState:!1,eagerState:null,next:null};if($r(e))gf(n,f);else{var h=e.alternate;if(e.lanes===0&&(h===null||h.lanes===0)&&(h=n.lastRenderedReducer,h!==null))try{var C=n.lastRenderedState,z=h(C,s);if(f.hasEagerState=!0,f.eagerState=z,ei(z,C))return Je(e,n,f,0),Ot===null&&Ct(),!1}catch{}finally{}if(s=qe(e,n,f,l),s!==null)return Pn(s,e,l),_f(s,n,l),!0}return!1}function yl(e,n,s,l){if(l={lane:2,revertLane:fe(),action:l,hasEagerState:!1,eagerState:null,next:null},$r(e)){if(n)throw Error(o(479))}else n=qe(e,s,l,2),n!==null&&Pn(n,e,2)}function $r(e){var n=e.alternate;return e===ut||n!==null&&n===ut}function gf(e,n){Rs=yo=!0;var s=e.pending;s===null?n.next=n:(n.next=s.next,s.next=n),e.pending=n}function _f(e,n,s){if((s&4194176)!==0){var l=n.lanes;l&=e.pendingLanes,s|=l,n.lanes=s,Q(e,s)}}function xl(e,n,s,l){n=e.memoizedState,s=s(l,n),s=s==null?n:rc({},n,s),e.memoizedState=s,e.lanes===0&&(e.updateQueue.baseState=s)}function Sf(e,n,s,l,f,h,C){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,h,C):n.prototype&&n.prototype.isPureReactComponent?!Ee(s,l)||!Ee(f,h):!0}function Ef(e,n,s,l){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(s,l),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(s,l),n.state!==e&&Dc.enqueueReplaceState(n,n.state,null)}function Ba(e,n){var s=n;if("ref"in n){s={};for(var l in n)l!=="ref"&&(s[l]=n[l])}if(e=e.defaultProps){s===n&&(s=rc({},s));for(var f in e)s[f]===void 0&&(s[f]=e[f])}return s}function eo(e,n){try{var s=e.onUncaughtError;s(n.value,{componentStack:n.stack})}catch(l){setTimeout(function(){throw l})}}function Tf(e,n,s){try{var l=e.onCaughtError;l(s.value,{componentStack:s.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(f){setTimeout(function(){throw f})}}function Al(e,n,s){return s=pe(s),s.tag=3,s.payload={element:null},s.callback=function(){eo(e,n)},s}function Mf(e){return e=pe(e),e.tag=3,e}function yf(e,n,s,l){var f=s.type.getDerivedStateFromError;if(typeof f=="function"){var h=l.value;e.payload=function(){return f(h)},e.callback=function(){Tf(n,s,l)}}var C=s.stateNode;C!==null&&typeof C.componentDidCatch=="function"&&(e.callback=function(){Tf(n,s,l),typeof f!="function"&&(Ma===null?Ma=new Set([this]):Ma.add(this));var z=l.stack;this.componentDidCatch(l.value,{componentStack:z!==null?z:""})})}function Om(e,n,s,l,f){if(s.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(n=s.alternate,n!==null&&lr(n,s,f,!0),s=di.current,s!==null){switch(s.tag){case 13:return Ni===null?$l():s.alternate===null&&jt===0&&(jt=3),s.flags&=-257,s.flags|=65536,s.lanes=f,l===To?s.flags|=16384:(n=s.updateQueue,n===null?s.updateQueue=new Set([l]):n.add(l),tc(e,l,f)),!1;case 22:return s.flags|=65536,l===To?s.flags|=16384:(n=s.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([l])},s.updateQueue=n):(s=n.retryQueue,s===null?n.retryQueue=new Set([l]):s.add(l)),tc(e,l,f)),!1}throw Error(o(435,s.tag))}return tc(e,l,f),$l(),!1}if(Tt)return n=di.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=f,l!==Mc&&(e=Error(o(422),{cause:l}),H(de(e,s)))):(l!==Mc&&(n=Error(o(423),{cause:l}),H(de(n,s))),e=e.current.alternate,e.flags|=65536,f&=-f,e.lanes|=f,l=de(l,s),f=Al(e.stateNode,l,f),Ie(e,f),jt!==4&&(jt=2)),!1;var h=Error(o(520),{cause:l});if(h=de(h,s),xr===null?xr=[h]:xr.push(h),jt!==4&&(jt=2),n===null)return!0;l=de(l,s),s=n;do{switch(s.tag){case 3:return s.flags|=65536,e=f&-f,s.lanes|=e,e=Al(s.stateNode,l,e),Ie(s,e),!1;case 1:if(n=s.type,h=s.stateNode,(s.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||h!==null&&typeof h.componentDidCatch=="function"&&(Ma===null||!Ma.has(h))))return s.flags|=65536,f&=-f,s.lanes|=f,f=Mf(f),yf(f,e,s,l),Ie(s,f),!1}s=s.return}while(s!==null);return!1}function hn(e,n,s,l){n.child=e===null?sp(n,null,s,l):Wa(n,e.child,s,l)}function xf(e,n,s,l,f){s=s.render;var h=n.ref;if("ref"in l){var C={};for(var z in l)z!=="ref"&&(C[z]=l[z])}else C=l;return Oa(n),l=ir(e,n,s,C,h,f),z=ar(),e!==null&&!un?(sr(e,n,f),Xi(e,n,f)):(Tt&&z&&ot(n),n.flags|=1,hn(e,n,l,f),n.child)}function Af(e,n,s,l,f){if(e===null){var h=s.type;return typeof h=="function"&&!nc(h)&&h.defaultProps===void 0&&s.compare===null?(n.tag=15,n.type=h,Rf(e,n,h,l,f)):(e=lo(s.type,null,l,n,n.mode,f),e.ref=n.ref,e.return=n,n.child=e)}if(h=e.child,!Nl(e,f)){var C=h.memoizedProps;if(s=s.compare,s=s!==null?s:Ee,s(C,l)&&e.ref===n.ref)return Xi(e,n,f)}return n.flags|=1,e=pa(h,l),e.ref=n.ref,e.return=n,n.child=e}function Rf(e,n,s,l,f){if(e!==null){var h=e.memoizedProps;if(Ee(h,l)&&e.ref===n.ref)if(un=!1,n.pendingProps=l=h,Nl(e,f))(e.flags&131072)!==0&&(un=!0);else return n.lanes=e.lanes,Xi(e,n,f)}return Rl(e,n,s,l,f)}function bf(e,n,s){var l=n.pendingProps,f=l.children,h=(n.stateNode._pendingVisibility&2)!==0,C=e!==null?e.memoizedState:null;if(or(e,n),l.mode==="hidden"||h){if((n.flags&128)!==0){if(l=C!==null?C.baseLanes|s:s,e!==null){for(f=n.child=e.child,h=0;f!==null;)h=h|f.lanes|f.childLanes,f=f.sibling;n.childLanes=h&~l}else n.childLanes=0,n.child=null;return Uf(e,n,l,s)}if((s&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},e!==null&&io(n,C!==null?C.cachePool:null),C!==null?tr(n,C):xi(),nr(n);else return n.lanes=n.childLanes=536870912,Uf(e,n,C!==null?C.baseLanes|s:s,s)}else C!==null?(io(n,C.cachePool),tr(n,C),kn(),n.memoizedState=null):(e!==null&&io(n,null),xi(),kn());return hn(e,n,f,s),n.child}function Uf(e,n,s,l){var f=Il();return f=f===null?null:{parent:Yi?Qt._currentValue:Qt._currentValue2,pool:f},n.memoizedState={baseLanes:s,cachePool:f},e!==null&&io(n,null),xi(),nr(n),e!==null&&lr(e,n,l,!0),null}function or(e,n){var s=n.ref;if(s===null)e!==null&&e.ref!==null&&(n.flags|=2097664);else{if(typeof s!="function"&&typeof s!="object")throw Error(o(284));(e===null||e.ref!==s)&&(n.flags|=2097664)}}function Rl(e,n,s,l,f){return Oa(n),s=ir(e,n,s,l,void 0,f),l=ar(),e!==null&&!un?(sr(e,n,f),Xi(e,n,f)):(Tt&&l&&ot(n),n.flags|=1,hn(e,n,s,f),n.child)}function Cf(e,n,s,l,f,h){return Oa(n),n.updateQueue=null,s=Zr(n,l,s,f),Qr(e),l=ar(),e!==null&&!un?(sr(e,n,h),Xi(e,n,h)):(Tt&&l&&ot(n),n.flags|=1,hn(e,n,s,h),n.child)}function Df(e,n,s,l,f){if(Oa(n),n.stateNode===null){var h=ms,C=s.contextType;typeof C=="object"&&C!==null&&(h=En(C)),h=new s(l,h),n.memoizedState=h.state!==null&&h.state!==void 0?h.state:null,h.updater=Dc,n.stateNode=h,h._reactInternals=n,h=n.stateNode,h.props=l,h.state=n.memoizedState,h.refs={},Be(n),C=s.contextType,h.context=typeof C=="object"&&C!==null?En(C):ms,h.state=n.memoizedState,C=s.getDerivedStateFromProps,typeof C=="function"&&(xl(n,s,C,l),h.state=n.memoizedState),typeof s.getDerivedStateFromProps=="function"||typeof h.getSnapshotBeforeUpdate=="function"||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(C=h.state,typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount(),C!==h.state&&Dc.enqueueReplaceState(h,h.state,null),$e(n,l,h,f),ye(),h.state=n.memoizedState),typeof h.componentDidMount=="function"&&(n.flags|=4194308),l=!0}else if(e===null){h=n.stateNode;var z=n.memoizedProps,Y=Ba(s,z);h.props=Y;var re=h.context,_e=s.contextType;C=ms,typeof _e=="object"&&_e!==null&&(C=En(_e));var Re=s.getDerivedStateFromProps;_e=typeof Re=="function"||typeof h.getSnapshotBeforeUpdate=="function",z=n.pendingProps!==z,_e||typeof h.UNSAFE_componentWillReceiveProps!="function"&&typeof h.componentWillReceiveProps!="function"||(z||re!==C)&&Ef(n,h,l,C),_a=!1;var be=n.memoizedState;h.state=be,$e(n,l,h,f),ye(),re=n.memoizedState,z||be!==re||_a?(typeof Re=="function"&&(xl(n,s,Re,l),re=n.memoizedState),(Y=_a||Sf(n,s,Y,l,be,re,C))?(_e||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount()),typeof h.componentDidMount=="function"&&(n.flags|=4194308)):(typeof h.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=l,n.memoizedState=re),h.props=l,h.state=re,h.context=C,l=Y):(typeof h.componentDidMount=="function"&&(n.flags|=4194308),l=!1)}else{h=n.stateNode,Oe(e,n),C=n.memoizedProps,_e=Ba(s,C),h.props=_e,Re=n.pendingProps,be=h.context,re=s.contextType,Y=ms,typeof re=="object"&&re!==null&&(Y=En(re)),z=s.getDerivedStateFromProps,(re=typeof z=="function"||typeof h.getSnapshotBeforeUpdate=="function")||typeof h.UNSAFE_componentWillReceiveProps!="function"&&typeof h.componentWillReceiveProps!="function"||(C!==Re||be!==Y)&&Ef(n,h,l,Y),_a=!1,be=n.memoizedState,h.state=be,$e(n,l,h,f),ye();var nt=n.memoizedState;C!==Re||be!==nt||_a||e!==null&&e.dependencies!==null&&to(e.dependencies)?(typeof z=="function"&&(xl(n,s,z,l),nt=n.memoizedState),(_e=_a||Sf(n,s,_e,l,be,nt,Y)||e!==null&&e.dependencies!==null&&to(e.dependencies))?(re||typeof h.UNSAFE_componentWillUpdate!="function"&&typeof h.componentWillUpdate!="function"||(typeof h.componentWillUpdate=="function"&&h.componentWillUpdate(l,nt,Y),typeof h.UNSAFE_componentWillUpdate=="function"&&h.UNSAFE_componentWillUpdate(l,nt,Y)),typeof h.componentDidUpdate=="function"&&(n.flags|=4),typeof h.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof h.componentDidUpdate!="function"||C===e.memoizedProps&&be===e.memoizedState||(n.flags|=4),typeof h.getSnapshotBeforeUpdate!="function"||C===e.memoizedProps&&be===e.memoizedState||(n.flags|=1024),n.memoizedProps=l,n.memoizedState=nt),h.props=l,h.state=nt,h.context=Y,l=_e):(typeof h.componentDidUpdate!="function"||C===e.memoizedProps&&be===e.memoizedState||(n.flags|=4),typeof h.getSnapshotBeforeUpdate!="function"||C===e.memoizedProps&&be===e.memoizedState||(n.flags|=1024),l=!1)}return h=l,or(e,n),l=(n.flags&128)!==0,h||l?(h=n.stateNode,s=l&&typeof s.getDerivedStateFromError!="function"?null:h.render(),n.flags|=1,e!==null&&l?(n.child=Wa(n,e.child,null,f),n.child=Wa(n,null,s,f)):hn(e,n,s,f),n.memoizedState=h.state,e=n.child):e=Xi(e,n,f),e}function wf(e,n,s,l){return Kt(),n.flags|=256,hn(e,n,s,l),n.child}function bl(e){return{baseLanes:e,cachePool:If()}}function Ul(e,n,s){return e=e!==null?e.childLanes&~s:0,n&&(e|=pi),e}function Pf(e,n,s){var l=n.pendingProps,f=!1,h=(n.flags&128)!==0,C;if((C=h)||(C=e!==null&&e.memoizedState===null?!1:(sn.current&2)!==0),C&&(f=!0,n.flags&=-129),C=(n.flags&32)!==0,n.flags&=-33,e===null){if(Tt){if(f?Ai(n):kn(),Tt){var z=yn,Y;(Y=z)&&(z=$v(z,Pi),z!==null?(n.memoizedState={dehydrated:z,treeContext:Xa!==null?{id:Ki,overflow:Qi}:null,retryLane:536870912},Y=a(18,null,null,0),Y.stateNode=z,Y.return=n,n.child=Y,Nn=n,yn=null,Y=!0):Y=!1),Y||Ue(n)}if(z=n.memoizedState,z!==null&&(z=z.dehydrated,z!==null))return gc(z)?n.lanes=16:n.lanes=536870912,null;ri(n)}return z=l.children,l=l.fallback,f?(kn(),f=n.mode,z=Dl({mode:"hidden",children:z},f),l=za(l,f,s,null),z.return=n,l.return=n,z.sibling=l,n.child=z,f=n.child,f.memoizedState=bl(s),f.childLanes=Ul(e,C,s),n.memoizedState=wc,l):(Ai(n),Cl(n,z))}if(Y=e.memoizedState,Y!==null&&(z=Y.dehydrated,z!==null)){if(h)n.flags&256?(Ai(n),n.flags&=-257,n=wl(e,n,s)):n.memoizedState!==null?(kn(),n.child=e.child,n.flags|=128,n=null):(kn(),f=l.fallback,z=n.mode,l=Dl({mode:"visible",children:l.children},z),f=za(f,z,s,null),f.flags|=2,l.return=n,f.return=n,l.sibling=f,n.child=l,Wa(n,e.child,null,s),l=n.child,l.memoizedState=bl(s),l.childLanes=Ul(e,C,s),n.memoizedState=wc,n=f);else if(Ai(n),gc(z))C=qv(z).digest,l=Error(o(419)),l.stack="",l.digest=C,H({value:l,source:null,stack:null}),n=wl(e,n,s);else if(un||lr(e,n,s,!1),C=(s&e.childLanes)!==0,un||C){if(C=Ot,C!==null){if(l=s&-s,(l&42)!==0)l=1;else switch(l){case 2:l=1;break;case 8:l=4;break;case 32:l=16;break;case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:l=64;break;case 268435456:l=134217728;break;default:l=0}if(l=(l&(C.suspendedLanes|s))!==0?0:l,l!==0&&l!==Y.retryLane)throw Y.retryLane=l,De(e,l),Pn(C,e,l),op}vc(z)||$l(),n=wl(e,n,s)}else vc(z)?(n.flags|=128,n.child=e.child,n=Km.bind(null,e),kv(z,n),n=null):(e=Y.treeContext,oi&&(yn=Zv(z),Nn=n,Tt=!0,Ui=null,Pi=!1,e!==null&&(ci[ui++]=Ki,ci[ui++]=Qi,ci[ui++]=Xa,Ki=e.id,Qi=e.overflow,Xa=n)),n=Cl(n,l.children),n.flags|=4096);return n}return f?(kn(),f=l.fallback,z=n.mode,Y=e.child,h=Y.sibling,l=pa(Y,{mode:"hidden",children:l.children}),l.subtreeFlags=Y.subtreeFlags&31457280,h!==null?f=pa(h,f):(f=za(f,z,s,null),f.flags|=2),f.return=n,l.return=n,l.sibling=f,n.child=l,l=f,f=n.child,z=e.child.memoizedState,z===null?z=bl(s):(Y=z.cachePool,Y!==null?(h=Yi?Qt._currentValue:Qt._currentValue2,Y=Y.parent!==h?{parent:h,pool:h}:Y):Y=If(),z={baseLanes:z.baseLanes|s,cachePool:Y}),f.memoizedState=z,f.childLanes=Ul(e,C,s),n.memoizedState=wc,l):(Ai(n),s=e.child,e=s.sibling,s=pa(s,{mode:"visible",children:l.children}),s.return=n,s.sibling=null,e!==null&&(C=n.deletions,C===null?(n.deletions=[e],n.flags|=16):C.push(e)),n.child=s,n.memoizedState=null,s)}function Cl(e,n){return n=Dl({mode:"visible",children:n},e.mode),n.return=e,e.child=n}function Dl(e,n){return Md(e,n,0,null)}function wl(e,n,s){return Wa(n,e.child,null,s),e=Cl(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function Nf(e,n,s){e.lanes|=n;var l=e.alternate;l!==null&&(l.lanes|=n),Ll(e.return,n,s)}function Pl(e,n,s,l,f){var h=e.memoizedState;h===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:l,tail:s,tailMode:f}:(h.isBackwards=n,h.rendering=null,h.renderingStartTime=0,h.last=l,h.tail=s,h.tailMode=f)}function Lf(e,n,s){var l=n.pendingProps,f=l.revealOrder,h=l.tail;if(hn(e,n,l.children,s),l=sn.current,(l&2)!==0)l=l&1|2,n.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Nf(e,s,n);else if(e.tag===19)Nf(e,s,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break e;for(;e.sibling===null;){if(e.return===null||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}l&=1}switch(x(sn,l),f){case"forwards":for(s=n.child,f=null;s!==null;)e=s.alternate,e!==null&&Gi(e)===null&&(f=s),s=s.sibling;s=f,s===null?(f=n.child,n.child=null):(f=s.sibling,s.sibling=null),Pl(n,!1,f,s,h);break;case"backwards":for(s=null,f=n.child,n.child=null;f!==null;){if(e=f.alternate,e!==null&&Gi(e)===null){n.child=f;break}e=f.sibling,f.sibling=s,s=f,f=e}Pl(n,!0,s,null,h);break;case"together":Pl(n,!1,null,null,void 0);break;default:n.memoizedState=null}return n.child}function Xi(e,n,s){if(e!==null&&(n.dependencies=e.dependencies),Ta|=n.lanes,(s&n.childLanes)===0)if(e!==null){if(lr(e,n,s,!1),(s&n.childLanes)===0)return null}else return null;if(e!==null&&n.child!==e.child)throw Error(o(153));if(n.child!==null){for(e=n.child,s=pa(e,e.pendingProps),n.child=s,s.return=n;e.sibling!==null;)e=e.sibling,s=s.sibling=pa(e,e.pendingProps),s.return=n;s.sibling=null}return n.child}function Nl(e,n){return(e.lanes&n)!==0?!0:(e=e.dependencies,!!(e!==null&&to(e)))}function Im(e,n,s){switch(n.tag){case 3:mt(n,n.stateNode.containerInfo),ca(n,Qt,e.memoizedState.cache),Kt();break;case 27:case 5:oe(n);break;case 4:mt(n,n.stateNode.containerInfo);break;case 10:ca(n,n.type,n.memoizedProps.value);break;case 13:var l=n.memoizedState;if(l!==null)return l.dehydrated!==null?(Ai(n),n.flags|=128,null):(s&n.child.childLanes)!==0?Pf(e,n,s):(Ai(n),e=Xi(e,n,s),e!==null?e.sibling:null);Ai(n);break;case 19:var f=(e.flags&128)!==0;if(l=(s&n.childLanes)!==0,l||(lr(e,n,s,!1),l=(s&n.childLanes)!==0),f){if(l)return Lf(e,n,s);n.flags|=128}if(f=n.memoizedState,f!==null&&(f.rendering=null,f.tail=null,f.lastEffect=null),x(sn,sn.current),l)break;return null;case 22:case 23:return n.lanes=0,bf(e,n,s);case 24:ca(n,Qt,e.memoizedState.cache)}return Xi(e,n,s)}function Bf(e,n,s){if(e!==null)if(e.memoizedProps!==n.pendingProps)un=!0;else{if(!Nl(e,s)&&(n.flags&128)===0)return un=!1,Im(e,n,s);un=(e.flags&131072)!==0}else un=!1,Tt&&(n.flags&1048576)!==0&&Qe(n,go,n.index);switch(n.lanes=0,n.tag){case 16:e:{e=n.pendingProps;var l=n.elementType,f=l._init;if(l=f(l._payload),n.type=l,typeof l=="function")nc(l)?(e=Ba(l,e),n.tag=1,n=Df(null,n,l,e,s)):(n.tag=0,n=Rl(null,n,l,e,s));else{if(l!=null){if(f=l.$$typeof,f===lc){n.tag=11,n=xf(null,n,l,e,s);break e}else if(f===fc){n.tag=14,n=Af(null,n,l,e,s);break e}}throw n=u(l)||l,Error(o(306,n,""))}}return n;case 0:return Rl(e,n,n.type,n.pendingProps,s);case 1:return l=n.type,f=Ba(l,n.pendingProps),Df(e,n,l,f,s);case 3:e:{if(mt(n,n.stateNode.containerInfo),e===null)throw Error(o(387));var h=n.pendingProps;f=n.memoizedState,l=f.element,Oe(e,n),$e(n,h,null,s);var C=n.memoizedState;if(h=C.cache,ca(n,Qt,h),h!==f.cache&&Bl(n,[Qt],s,!0),ye(),h=C.element,oi&&f.isDehydrated)if(f={element:h,isDehydrated:!1,cache:C.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=wf(e,n,h,s);break e}else if(h!==l){l=de(Error(o(424)),n),H(l),n=wf(e,n,h,s);break e}else for(oi&&(yn=Qv(n.stateNode.containerInfo),Nn=n,Tt=!0,Ui=null,Pi=!0),s=sp(n,null,h,s),n.child=s;s;)s.flags=s.flags&-3|4096,s=s.sibling;else{if(Kt(),h===l){n=Xi(e,n,s);break e}hn(e,n,h,s)}n=n.child}return n;case 26:if(li)return or(e,n),e===null?(s=Qd(n.type,null,n.pendingProps,null))?n.memoizedState=s:Tt||(n.stateNode=fg(n.type,n.pendingProps,ga.current,n)):n.memoizedState=Qd(n.type,e.memoizedProps,n.pendingProps,e.memoizedState),null;case 27:if(Mn)return oe(n),e===null&&Mn&&Tt&&(l=n.stateNode=tp(n.type,n.pendingProps,ga.current,mn.current,!1),Nn=n,Pi=!0,yn=kd(l)),l=n.pendingProps.children,e!==null||Tt?hn(e,n,l,s):n.child=Wa(n,null,l,s),or(e,n),n.child;case 5:return e===null&&Tt&&(lg(n.type,n.pendingProps,mn.current),(f=l=yn)&&(l=jv(l,n.type,n.pendingProps,Pi),l!==null?(n.stateNode=l,Nn=n,yn=kd(l),Pi=!1,f=!0):f=!1),f||Ue(n)),oe(n),f=n.type,h=n.pendingProps,C=e!==null?e.memoizedProps:null,l=h.children,fo(f,h)?l=null:C!==null&&fo(f,C)&&(n.flags|=32),n.memoizedState!==null&&(f=ir(e,n,_l,null,null,s),Yi?Va._currentValue=f:Va._currentValue2=f),or(e,n),hn(e,n,l,s),n.child;case 6:return e===null&&Tt&&(cg(n.pendingProps,mn.current),(e=s=yn)&&(s=Jv(s,n.pendingProps,Pi),s!==null?(n.stateNode=s,Nn=n,yn=null,e=!0):e=!1),e||Ue(n)),null;case 13:return Pf(e,n,s);case 4:return mt(n,n.stateNode.containerInfo),l=n.pendingProps,e===null?n.child=Wa(n,null,l,s):hn(e,n,l,s),n.child;case 11:return xf(e,n,n.type,n.pendingProps,s);case 7:return hn(e,n,n.pendingProps,s),n.child;case 8:return hn(e,n,n.pendingProps.children,s),n.child;case 12:return hn(e,n,n.pendingProps.children,s),n.child;case 10:return l=n.pendingProps,ca(n,n.type,l.value),hn(e,n,l.children,s),n.child;case 9:return f=n.type._context,l=n.pendingProps.children,Oa(n),f=En(f),l=l(f),n.flags|=1,hn(e,n,l,s),n.child;case 14:return Af(e,n,n.type,n.pendingProps,s);case 15:return Rf(e,n,n.type,n.pendingProps,s);case 19:return Lf(e,n,s);case 22:return bf(e,n,s);case 24:return Oa(n),l=En(Qt),e===null?(f=Il(),f===null&&(f=Ot,h=Ol(),f.pooledCache=h,h.refCount++,h!==null&&(f.pooledCacheLanes|=s),f=h),n.memoizedState={parent:l,cache:f},Be(n),ca(n,Qt,f)):((e.lanes&s)!==0&&(Oe(e,n),$e(n,null,null,s),ye()),f=e.memoizedState,h=n.memoizedState,f.parent!==l?(f={parent:l,cache:l},n.memoizedState=f,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=f),ca(n,Qt,l)):(l=h.cache,ca(n,Qt,l),l!==f.cache&&Bl(n,[Qt],s,!0))),hn(e,n,n.pendingProps.children,s),n.child;case 29:throw n.pendingProps}throw Error(o(156,n.tag))}function ca(e,n,s){Yi?(x(Ao,n._currentValue),n._currentValue=s):(x(Ao,n._currentValue2),n._currentValue2=s)}function Wi(e){var n=Ao.current;Yi?e._currentValue=n:e._currentValue2=n,m(Ao)}function Ll(e,n,s){for(;e!==null;){var l=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,l!==null&&(l.childLanes|=n)):l!==null&&(l.childLanes&n)!==n&&(l.childLanes|=n),e===s)break;e=e.return}}function Bl(e,n,s,l){var f=e.child;for(f!==null&&(f.return=e);f!==null;){var h=f.dependencies;if(h!==null){var C=f.child;h=h.firstContext;e:for(;h!==null;){var z=h;h=f;for(var Y=0;Y<n.length;Y++)if(z.context===n[Y]){h.lanes|=s,z=h.alternate,z!==null&&(z.lanes|=s),Ll(h.return,s,e),l||(C=null);break e}h=z.next}}else if(f.tag===18){if(C=f.return,C===null)throw Error(o(341));C.lanes|=s,h=C.alternate,h!==null&&(h.lanes|=s),Ll(C,s,e),C=null}else C=f.child;if(C!==null)C.return=f;else for(C=f;C!==null;){if(C===e){C=null;break}if(f=C.sibling,f!==null){f.return=C.return,C=f;break}C=C.return}f=C}}function lr(e,n,s,l){e=null;for(var f=n,h=!1;f!==null;){if(!h){if((f.flags&524288)!==0)h=!0;else if((f.flags&262144)!==0)break}if(f.tag===10){var C=f.alternate;if(C===null)throw Error(o(387));if(C=C.memoizedProps,C!==null){var z=f.type;ei(f.pendingProps.value,C.value)||(e!==null?e.push(z):e=[z])}}else if(f===_o.current){if(C=f.alternate,C===null)throw Error(o(387));C.memoizedState.memoizedState!==f.memoizedState.memoizedState&&(e!==null?e.push(Va):e=[Va])}f=f.return}e!==null&&Bl(n,e,s,l),n.flags|=262144}function to(e){for(e=e.firstContext;e!==null;){var n=e.context;if(!ei(Yi?n._currentValue:n._currentValue2,e.memoizedValue))return!0;e=e.next}return!1}function Oa(e){Ka=e,Zi=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function En(e){return Of(Ka,e)}function no(e,n){return Ka===null&&Oa(e),Of(e,n)}function Of(e,n){var s=Yi?n._currentValue:n._currentValue2;if(n={context:n,memoizedValue:s,next:null},Zi===null){if(e===null)throw Error(o(308));Zi=n,e.dependencies={lanes:0,firstContext:n},e.flags|=524288}else Zi=Zi.next=n;return s}function Ol(){return{controller:new Ug,data:new Map,refCount:0}}function cr(e){e.refCount--,e.refCount===0&&Cg(Dg,function(){e.controller.abort()})}function Il(){var e=Qa.current;return e!==null?e:Ot.pooledCache}function io(e,n){n===null?x(Qa,Qa.current):x(Qa,n.pool)}function If(){var e=Il();return e===null?null:{parent:Yi?Qt._currentValue:Qt._currentValue2,pool:e}}function Yn(e){e.flags|=4}function Ff(e,n){if(e!==null&&e.child===n.child)return!1;if((n.flags&16)!==0)return!0;for(e=n.child;e!==null;){if((e.flags&13878)!==0||(e.subtreeFlags&13878)!==0)return!0;e=e.sibling}return!1}function Fl(e,n,s,l){if(Tn)for(s=n.child;s!==null;){if(s.tag===5||s.tag===6)hc(e,s.stateNode);else if(!(s.tag===4||Mn&&s.tag===27)&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===n)break;for(;s.sibling===null;){if(s.return===null||s.return===n)return;s=s.return}s.sibling.return=s.return,s=s.sibling}else if(va)for(var f=n.child;f!==null;){if(f.tag===5){var h=f.stateNode;s&&l&&(h=Xd(h,f.type,f.memoizedProps)),hc(e,h)}else if(f.tag===6)h=f.stateNode,s&&l&&(h=Wd(h,f.memoizedProps)),hc(e,h);else if(f.tag!==4){if(f.tag===22&&f.memoizedState!==null)h=f.child,h!==null&&(h.return=f),Fl(e,f,!0,!0);else if(f.child!==null){f.child.return=f,f=f.child;continue}}if(f===n)break;for(;f.sibling===null;){if(f.return===null||f.return===n)return;f=f.return}f.sibling.return=f.return,f=f.sibling}}function Hf(e,n,s,l){if(va)for(var f=n.child;f!==null;){if(f.tag===5){var h=f.stateNode;s&&l&&(h=Xd(h,f.type,f.memoizedProps)),Gd(e,h)}else if(f.tag===6)h=f.stateNode,s&&l&&(h=Wd(h,f.memoizedProps)),Gd(e,h);else if(f.tag!==4){if(f.tag===22&&f.memoizedState!==null)h=f.child,h!==null&&(h.return=f),Hf(e,f,!(f.memoizedProps!==null&&f.memoizedProps.mode==="manual"),!0);else if(f.child!==null){f.child.return=f,f=f.child;continue}}if(f===n)break;for(;f.sibling===null;){if(f.return===null||f.return===n)return;f=f.return}f.sibling.return=f.return,f=f.sibling}}function zf(e,n){if(va&&Ff(e,n)){e=n.stateNode;var s=e.containerInfo,l=zd();Hf(l,n,!1,!1),e.pendingChildren=l,Yn(n),Wv(s,l)}}function Hl(e,n,s,l){if(Tn)e.memoizedProps!==l&&Yn(n);else if(va){var f=e.stateNode,h=e.memoizedProps;if((e=Ff(e,n))||h!==l){var C=mn.current;h=Xv(f,s,h,l,!e,null),h===f?n.stateNode=f:(Ld(h,s,l,C)&&Yn(n),n.stateNode=h,e?Fl(h,n,!1,!1):Yn(n))}else n.stateNode=f}}function zl(e,n,s){if(gv(n,s)){if(e.flags|=16777216,!Id(n,s))if(fd())e.flags|=8192;else throw ys=To,Uc}else e.flags&=-16777217}function Gf(e,n){if(pg(n)){if(e.flags|=16777216,!ep(n))if(fd())e.flags|=8192;else throw ys=To,Uc}else e.flags&=-16777217}function ao(e,n){n!==null&&(e.flags|=4),e.flags&16384&&(n=e.tag!==22?y():536870912,e.lanes|=n,Ds|=n)}function ur(e,n){if(!Tt)switch(e.tailMode){case"hidden":n=e.tail;for(var s=null;n!==null;)n.alternate!==null&&(s=n),n=n.sibling;s===null?e.tail=null:s.sibling=null;break;case"collapsed":s=e.tail;for(var l=null;s!==null;)s.alternate!==null&&(l=s),s=s.sibling;l===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function Yt(e){var n=e.alternate!==null&&e.alternate.child===e.child,s=0,l=0;if(n)for(var f=e.child;f!==null;)s|=f.lanes|f.childLanes,l|=f.subtreeFlags&31457280,l|=f.flags&31457280,f.return=e,f=f.sibling;else for(f=e.child;f!==null;)s|=f.lanes|f.childLanes,l|=f.subtreeFlags,l|=f.flags,f.return=e,f=f.sibling;return e.subtreeFlags|=l,e.childLanes=s,n}function Fm(e,n,s){var l=n.pendingProps;switch(Ut(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Yt(n),null;case 1:return Yt(n),null;case 3:return s=n.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),n.memoizedState.cache!==l&&(n.flags|=2048),Wi(Qt),lt(),s.pendingContext&&(s.context=s.pendingContext,s.pendingContext=null),(e===null||e.child===null)&&(st(n)?Yn(n):e===null||e.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,Ui!==null&&(jl(Ui),Ui=null))),zf(e,n),Yt(n),null;case 26:if(li){s=n.type;var f=n.memoizedState;return e===null?(Yn(n),f!==null?(Yt(n),Gf(n,f)):(Yt(n),zl(n,s,l))):f?f!==e.memoizedState?(Yn(n),Yt(n),Gf(n,f)):(Yt(n),n.flags&=-16777217):(Tn?e.memoizedProps!==l&&Yn(n):Hl(e,n,s,l),Yt(n),zl(n,s,l)),null}case 27:if(Mn){if(ue(n),s=ga.current,f=n.type,e!==null&&n.stateNode!=null)Tn?e.memoizedProps!==l&&Yn(n):Hl(e,n,f,l);else{if(!l){if(n.stateNode===null)throw Error(o(166));return Yt(n),null}e=mn.current,st(n)?Ze(n,e):(e=tp(f,l,s,e,!0),n.stateNode=e,Yn(n))}return Yt(n),null}case 5:if(ue(n),s=n.type,e!==null&&n.stateNode!=null)Hl(e,n,s,l);else{if(!l){if(n.stateNode===null)throw Error(o(166));return Yt(n),null}e=mn.current,st(n)?Ze(n,e):(f=uv(s,l,ga.current,e,n),Fl(f,n,!1,!1),n.stateNode=f,Ld(f,s,l,e)&&Yn(n))}return Yt(n),zl(n,n.type,n.pendingProps),null;case 6:if(e&&n.stateNode!=null)s=e.memoizedProps,Tn?s!==l&&Yn(n):va&&(s!==l?(n.stateNode=Bd(l,ga.current,mn.current,n),Yn(n)):n.stateNode=e.stateNode);else{if(typeof l!="string"&&n.stateNode===null)throw Error(o(166));if(e=ga.current,s=mn.current,st(n)){if(!oi)throw Error(o(176));if(e=n.stateNode,s=n.memoizedProps,l=null,f=Nn,f!==null)switch(f.tag){case 27:case 5:l=f.memoizedProps}tg(e,s,n,l)||Ue(n)}else n.stateNode=Bd(l,e,s,n)}return Yt(n),null;case 13:if(l=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(f=st(n),l!==null&&l.dehydrated!==null){if(e===null){if(!f)throw Error(o(318));if(!oi)throw Error(o(344));if(f=n.memoizedState,f=f!==null?f.dehydrated:null,!f)throw Error(o(317));ng(f,n)}else Kt(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Yt(n),f=!1}else Ui!==null&&(jl(Ui),Ui=null),f=!0;if(!f)return n.flags&256?(ri(n),n):(ri(n),null)}if(ri(n),(n.flags&128)!==0)return n.lanes=s,n;if(s=l!==null,e=e!==null&&e.memoizedState!==null,s){l=n.child,f=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(f=l.alternate.memoizedState.cachePool.pool);var h=null;l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(h=l.memoizedState.cachePool.pool),h!==f&&(l.flags|=2048)}return s!==e&&s&&(n.child.flags|=8192),ao(n,n.updateQueue),Yt(n),null;case 4:return lt(),zf(e,n),e===null&&pv(n.stateNode.containerInfo),Yt(n),null;case 10:return Wi(n.type),Yt(n),null;case 19:if(m(sn),f=n.memoizedState,f===null)return Yt(n),null;if(l=(n.flags&128)!==0,h=f.rendering,h===null)if(l)ur(f,!1);else{if(jt!==0||e!==null&&(e.flags&128)!==0)for(e=n.child;e!==null;){if(h=Gi(e),h!==null){for(n.flags|=128,ur(f,!1),e=h.updateQueue,n.updateQueue=e,ao(n,e),n.subtreeFlags=0,e=s,s=n.child;s!==null;)Td(s,e),s=s.sibling;return x(sn,sn.current&1|2),n.child}e=e.sibling}f.tail!==null&&bi()>Ar&&(n.flags|=128,l=!0,ur(f,!1),n.lanes=4194304)}else{if(!l)if(e=Gi(h),e!==null){if(n.flags|=128,l=!0,e=e.updateQueue,n.updateQueue=e,ao(n,e),ur(f,!0),f.tail===null&&f.tailMode==="hidden"&&!h.alternate&&!Tt)return Yt(n),null}else 2*bi()-f.renderingStartTime>Ar&&s!==536870912&&(n.flags|=128,l=!0,ur(f,!1),n.lanes=4194304);f.isBackwards?(h.sibling=n.child,n.child=h):(e=f.last,e!==null?e.sibling=h:n.child=h,f.last=h)}return f.tail!==null?(n=f.tail,f.rendering=n,f.tail=n.sibling,f.renderingStartTime=bi(),n.sibling=null,e=sn.current,x(sn,l?e&1|2:e&1),n):(Yt(n),null);case 22:case 23:return ri(n),La(),l=n.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(n.flags|=8192):l&&(n.flags|=8192),l?(s&536870912)!==0&&(n.flags&128)===0&&(Yt(n),n.subtreeFlags&6&&(n.flags|=8192)):Yt(n),s=n.updateQueue,s!==null&&ao(n,s.retryQueue),s=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(s=e.memoizedState.cachePool.pool),l=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(l=n.memoizedState.cachePool.pool),l!==s&&(n.flags|=2048),e!==null&&m(Qa),null;case 24:return s=null,e!==null&&(s=e.memoizedState.cache),n.memoizedState.cache!==s&&(n.flags|=2048),Wi(Qt),Yt(n),null;case 25:return null}throw Error(o(156,n.tag))}function Hm(e,n){switch(Ut(n),n.tag){case 1:return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return Wi(Qt),lt(),e=n.flags,(e&65536)!==0&&(e&128)===0?(n.flags=e&-65537|128,n):null;case 26:case 27:case 5:return ue(n),null;case 13:if(ri(n),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(o(340));Kt()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return m(sn),null;case 4:return lt(),null;case 10:return Wi(n.type),null;case 22:case 23:return ri(n),La(),e!==null&&m(Qa),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 24:return Wi(Qt),null;case 25:return null;default:return null}}function Vf(e,n){switch(Ut(n),n.tag){case 3:Wi(Qt),lt();break;case 26:case 27:case 5:ue(n);break;case 4:lt();break;case 13:ri(n);break;case 19:m(sn);break;case 10:Wi(n.type);break;case 22:case 23:ri(n),La(),e!==null&&m(Qa);break;case 24:Wi(Qt)}}function fr(e,n){try{var s=n.updateQueue,l=s!==null?s.lastEffect:null;if(l!==null){var f=l.next;s=f;do{if((s.tag&e)===e){l=void 0;var h=s.create,C=s.inst;l=h(),C.destroy=l}s=s.next}while(s!==f)}}catch(z){Dt(n,n.return,z)}}function ua(e,n,s){try{var l=n.updateQueue,f=l!==null?l.lastEffect:null;if(f!==null){var h=f.next;l=h;do{if((l.tag&e)===e){var C=l.inst,z=C.destroy;if(z!==void 0){C.destroy=void 0,f=n;var Y=s;try{z()}catch(re){Dt(f,Y,re)}}}l=l.next}while(l!==h)}}catch(re){Dt(n,n.return,re)}}function Xf(e){var n=e.updateQueue;if(n!==null){var s=e.stateNode;try{ge(n,s)}catch(l){Dt(e,e.return,l)}}}function Wf(e,n,s){s.props=Ba(e.type,e.memoizedProps),s.state=e.memoizedState;try{s.componentWillUnmount()}catch(l){Dt(e,n,l)}}function Ia(e,n){try{var s=e.ref;if(s!==null){var l=e.stateNode;switch(e.tag){case 26:case 27:case 5:var f=hr(l);break;default:f=l}typeof s=="function"?e.refCleanup=s(f):s.current=f}}catch(h){Dt(e,n,h)}}function Kn(e,n){var s=e.ref,l=e.refCleanup;if(s!==null)if(typeof l=="function")try{l()}catch(f){Dt(e,n,f)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof s=="function")try{s(null)}catch(f){Dt(e,n,f)}else s.current=null}function qf(e){var n=e.type,s=e.memoizedProps,l=e.stateNode;try{Pv(l,n,s,e)}catch(f){Dt(e,e.return,f)}}function kf(e,n,s){try{Nv(e.stateNode,e.type,s,n,e)}catch(l){Dt(e,e.return,l)}}function Yf(e){return e.tag===5||e.tag===3||(li?e.tag===26:!1)||(Mn?e.tag===27:!1)||e.tag===4}function Gl(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Yf(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&(!Mn||e.tag!==27)&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Vl(e,n,s){var l=e.tag;if(l===5||l===6)e=e.stateNode,n?Bv(s,e,n):Dv(s,e);else if(!(l===4||Mn&&l===27)&&(e=e.child,e!==null))for(Vl(e,n,s),e=e.sibling;e!==null;)Vl(e,n,s),e=e.sibling}function so(e,n,s){var l=e.tag;if(l===5||l===6)e=e.stateNode,n?Lv(s,e,n):Cv(s,e);else if(!(l===4||Mn&&l===27)&&(e=e.child,e!==null))for(so(e,n,s),e=e.sibling;e!==null;)so(e,n,s),e=e.sibling}function Kf(e,n,s){e=e.containerInfo;try{Vd(e,s)}catch(l){Dt(n,n.return,l)}}function zm(e,n){for(lv(e.containerInfo),fn=n;fn!==null;)if(e=fn,n=e.child,(e.subtreeFlags&1028)!==0&&n!==null)n.return=e,fn=n;else for(;fn!==null;){e=fn;var s=e.alternate;switch(n=e.flags,e.tag){case 0:break;case 11:case 15:break;case 1:if((n&1024)!==0&&s!==null){n=void 0;var l=e,f=s.memoizedProps;s=s.memoizedState;var h=l.stateNode;try{var C=Ba(l.type,f,l.elementType===l.type);n=h.getSnapshotBeforeUpdate(C,s),h.__reactInternalSnapshotBeforeUpdate=n}catch(z){Dt(l,l.return,z)}}break;case 3:(n&1024)!==0&&Tn&&Vv(e.stateNode.containerInfo);break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((n&1024)!==0)throw Error(o(163))}if(n=e.sibling,n!==null){n.return=e.return,fn=n;break}fn=e.return}return C=up,up=!1,C}function Qf(e,n,s){var l=s.flags;switch(s.tag){case 0:case 11:case 15:qi(e,s),l&4&&fr(5,s);break;case 1:if(qi(e,s),l&4)if(e=s.stateNode,n===null)try{e.componentDidMount()}catch(z){Dt(s,s.return,z)}else{var f=Ba(s.type,n.memoizedProps);n=n.memoizedState;try{e.componentDidUpdate(f,n,e.__reactInternalSnapshotBeforeUpdate)}catch(z){Dt(s,s.return,z)}}l&64&&Xf(s),l&512&&Ia(s,s.return);break;case 3:if(qi(e,s),l&64&&(l=s.updateQueue,l!==null)){if(e=null,s.child!==null)switch(s.child.tag){case 27:case 5:e=hr(s.child.stateNode);break;case 1:e=s.child.stateNode}try{ge(l,e)}catch(z){Dt(s,s.return,z)}}break;case 26:if(li){qi(e,s),l&512&&Ia(s,s.return);break}case 27:case 5:qi(e,s),n===null&&l&4&&qf(s),l&512&&Ia(s,s.return);break;case 12:qi(e,s);break;case 13:qi(e,s),l&4&&jf(e,s);break;case 22:if(f=s.memoizedState!==null||ji,!f){n=n!==null&&n.memoizedState!==null||Zt;var h=ji,C=Zt;ji=f,(Zt=n)&&!C?fa(e,s,(s.subtreeFlags&8772)!==0):qi(e,s),ji=h,Zt=C}l&512&&(s.memoizedProps.mode==="manual"?Ia(s,s.return):Kn(s,s.return));break;default:qi(e,s)}}function Zf(e){var n=e.alternate;n!==null&&(e.alternate=null,Zf(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&vv(n)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Ri(e,n,s){for(s=s.child;s!==null;)Xl(e,n,s),s=s.sibling}function Xl(e,n,s){if($n&&typeof $n.onCommitFiberUnmount=="function")try{$n.onCommitFiberUnmount(gr,s)}catch{}switch(s.tag){case 26:if(li){Zt||Kn(s,n),Ri(e,n,s),s.memoizedState?jd(s.memoizedState):s.stateNode&&$d(s.stateNode);break}case 27:if(Mn){Zt||Kn(s,n);var l=tn,f=ti;tn=s.stateNode,Ri(e,n,s),gg(s.stateNode),tn=l,ti=f;break}case 5:Zt||Kn(s,n);case 6:if(Tn){if(l=tn,f=ti,tn=null,Ri(e,n,s),tn=l,ti=f,tn!==null)if(ti)try{Iv(tn,s.stateNode)}catch(h){Dt(s,n,h)}else try{Ov(tn,s.stateNode)}catch(h){Dt(s,n,h)}}else Ri(e,n,s);break;case 18:Tn&&tn!==null&&(ti?og(tn,s.stateNode):rg(tn,s.stateNode));break;case 4:Tn?(l=tn,f=ti,tn=s.stateNode.containerInfo,ti=!0,Ri(e,n,s),tn=l,ti=f):(va&&Kf(s.stateNode,s,zd()),Ri(e,n,s));break;case 0:case 11:case 14:case 15:Zt||ua(2,s,n),Zt||ua(4,s,n),Ri(e,n,s);break;case 1:Zt||(Kn(s,n),l=s.stateNode,typeof l.componentWillUnmount=="function"&&Wf(s,n,l)),Ri(e,n,s);break;case 21:Ri(e,n,s);break;case 22:Zt||Kn(s,n),Zt=(l=Zt)||s.memoizedState!==null,Ri(e,n,s),Zt=l;break;default:Ri(e,n,s)}}function jf(e,n){if(oi&&n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{sg(e)}catch(s){Dt(n,n.return,s)}}function Gm(e){switch(e.tag){case 13:case 19:var n=e.stateNode;return n===null&&(n=e.stateNode=new cp),n;case 22:return e=e.stateNode,n=e._retryCache,n===null&&(n=e._retryCache=new cp),n;default:throw Error(o(435,e.tag))}}function Wl(e,n){var s=Gm(e);n.forEach(function(l){var f=Qm.bind(null,e,l);s.has(l)||(s.add(l),l.then(f,f))})}function Fn(e,n){var s=n.deletions;if(s!==null)for(var l=0;l<s.length;l++){var f=s[l],h=e,C=n;if(Tn){var z=C;e:for(;z!==null;){switch(z.tag){case 27:case 5:tn=z.stateNode,ti=!1;break e;case 3:tn=z.stateNode.containerInfo,ti=!0;break e;case 4:tn=z.stateNode.containerInfo,ti=!0;break e}z=z.return}if(tn===null)throw Error(o(160));Xl(h,C,f),tn=null,ti=!1}else Xl(h,C,f);h=f.alternate,h!==null&&(h.return=null),f.return=null}if(n.subtreeFlags&13878)for(n=n.child;n!==null;)Jf(n,e),n=n.sibling}function Jf(e,n){var s=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Fn(n,e),Qn(e),l&4&&(ua(3,e,e.return),fr(3,e),ua(5,e,e.return));break;case 1:Fn(n,e),Qn(e),l&512&&(Zt||s===null||Kn(s,s.return)),l&64&&ji&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(s=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=s===null?l:s.concat(l))));break;case 26:if(li){var f=Ci;Fn(n,e),Qn(e),l&512&&(Zt||s===null||Kn(s,s.return)),l&4&&(l=s!==null?s.memoizedState:null,n=e.memoizedState,s===null?n===null?e.stateNode===null?e.stateNode=ug(f,e.type,e.memoizedProps,e):Jd(f,e.type,e.stateNode):e.stateNode=Zd(f,n,e.memoizedProps):l!==n?(l===null?s.stateNode!==null&&$d(s.stateNode):jd(l),n===null?Jd(f,e.type,e.stateNode):Zd(f,n,e.memoizedProps)):n===null&&e.stateNode!==null&&kf(e,e.memoizedProps,s.memoizedProps));break}case 27:if(Mn&&l&4&&e.alternate===null){f=e.stateNode;var h=e.memoizedProps;try{mg(f),vg(e.type,h,f,e)}catch(_e){Dt(e,e.return,_e)}}case 5:if(Fn(n,e),Qn(e),l&512&&(Zt||s===null||Kn(s,s.return)),Tn){if(e.flags&32){n=e.stateNode;try{Hd(n)}catch(_e){Dt(e,e.return,_e)}}l&4&&e.stateNode!=null&&(n=e.memoizedProps,kf(e,n,s!==null?s.memoizedProps:n)),l&1024&&(Pc=!0)}break;case 6:if(Fn(n,e),Qn(e),l&4&&Tn){if(e.stateNode===null)throw Error(o(162));l=e.memoizedProps,s=s!==null?s.memoizedProps:l,n=e.stateNode;try{wv(n,s,l)}catch(_e){Dt(e,e.return,_e)}}break;case 3:if(li?(dg(),f=Ci,Ci=_c(n.containerInfo),Fn(n,e),Ci=f):Fn(n,e),Qn(e),l&4){if(Tn&&oi&&s!==null&&s.memoizedState.isDehydrated)try{ag(n.containerInfo)}catch(_e){Dt(e,e.return,_e)}if(va){l=n.containerInfo,s=n.pendingChildren;try{Vd(l,s)}catch(_e){Dt(e,e.return,_e)}}}Pc&&(Pc=!1,$f(e));break;case 4:li?(s=Ci,Ci=_c(e.stateNode.containerInfo),Fn(n,e),Qn(e),Ci=s):(Fn(n,e),Qn(e)),l&4&&va&&Kf(e.stateNode,e,e.stateNode.pendingChildren);break;case 12:Fn(n,e),Qn(e);break;case 13:Fn(n,e),Qn(e),e.child.flags&8192&&e.memoizedState!==null!=(s!==null&&s.memoizedState!==null)&&(Oc=bi()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Wl(e,l)));break;case 22:l&512&&(Zt||s===null||Kn(s,s.return)),f=e.memoizedState!==null;var C=s!==null&&s.memoizedState!==null,z=ji,Y=Zt;if(ji=z||f,Zt=Y||C,Fn(n,e),Zt=Y,ji=z,Qn(e),n=e.stateNode,n._current=e,n._visibility&=-3,n._visibility|=n._pendingVisibility&2,l&8192&&(n._visibility=f?n._visibility&-2:n._visibility|1,f&&(n=ji||Zt,s===null||C||n||os(e)),Tn&&(e.memoizedProps===null||e.memoizedProps.mode!=="manual"))){e:if(s=null,Tn)for(n=e;;){if(n.tag===5||li&&n.tag===26||Mn&&n.tag===27){if(s===null){C=s=n;try{h=C.stateNode,f?Fv(h):zv(C.stateNode,C.memoizedProps)}catch(_e){Dt(C,C.return,_e)}}}else if(n.tag===6){if(s===null){C=n;try{var re=C.stateNode;f?Hv(re):Gv(re,C.memoizedProps)}catch(_e){Dt(C,C.return,_e)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===e)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break e;for(;n.sibling===null;){if(n.return===null||n.return===e)break e;s===n&&(s=null),n=n.return}s===n&&(s=null),n.sibling.return=n.return,n=n.sibling}}l&4&&(l=e.updateQueue,l!==null&&(s=l.retryQueue,s!==null&&(l.retryQueue=null,Wl(e,s))));break;case 19:Fn(n,e),Qn(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Wl(e,l)));break;case 21:break;default:Fn(n,e),Qn(e)}}function Qn(e){var n=e.flags;if(n&2){try{if(Tn&&(!Mn||e.tag!==27)){e:{for(var s=e.return;s!==null;){if(Yf(s)){var l=s;break e}s=s.return}throw Error(o(160))}switch(l.tag){case 27:if(Mn){var f=l.stateNode,h=Gl(e);so(e,h,f);break}case 5:var C=l.stateNode;l.flags&32&&(Hd(C),l.flags&=-33);var z=Gl(e);so(e,z,C);break;case 3:case 4:var Y=l.stateNode.containerInfo,re=Gl(e);Vl(e,re,Y);break;default:throw Error(o(161))}}}catch(_e){Dt(e,e.return,_e)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function $f(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var n=e;$f(n),n.tag===5&&n.flags&1024&&Ev(n.stateNode),e=e.sibling}}function qi(e,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)Qf(e,n.alternate,n),n=n.sibling}function os(e){for(e=e.child;e!==null;){var n=e;switch(n.tag){case 0:case 11:case 14:case 15:ua(4,n,n.return),os(n);break;case 1:Kn(n,n.return);var s=n.stateNode;typeof s.componentWillUnmount=="function"&&Wf(n,n.return,s),os(n);break;case 26:case 27:case 5:Kn(n,n.return),os(n);break;case 22:Kn(n,n.return),n.memoizedState===null&&os(n);break;default:os(n)}e=e.sibling}}function fa(e,n,s){for(s=s&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var l=n.alternate,f=e,h=n,C=h.flags;switch(h.tag){case 0:case 11:case 15:fa(f,h,s),fr(4,h);break;case 1:if(fa(f,h,s),l=h,f=l.stateNode,typeof f.componentDidMount=="function")try{f.componentDidMount()}catch(re){Dt(l,l.return,re)}if(l=h,f=l.updateQueue,f!==null){var z=l.stateNode;try{var Y=f.shared.hiddenCallbacks;if(Y!==null)for(f.shared.hiddenCallbacks=null,f=0;f<Y.length;f++)V(Y[f],z)}catch(re){Dt(l,l.return,re)}}s&&C&64&&Xf(h),Ia(h,h.return);break;case 26:case 27:case 5:fa(f,h,s),s&&l===null&&C&4&&qf(h),Ia(h,h.return);break;case 12:fa(f,h,s);break;case 13:fa(f,h,s),s&&C&4&&jf(f,h);break;case 22:h.memoizedState===null&&fa(f,h,s),Ia(h,h.return);break;default:fa(f,h,s)}n=n.sibling}}function ql(e,n){var s=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(s=e.memoizedState.cachePool.pool),e=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(e=n.memoizedState.cachePool.pool),e!==s&&(e!=null&&e.refCount++,s!=null&&cr(s))}function kl(e,n){e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&cr(e))}function da(e,n,s,l){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)ed(e,n,s,l),n=n.sibling}function ed(e,n,s,l){var f=n.flags;switch(n.tag){case 0:case 11:case 15:da(e,n,s,l),f&2048&&fr(9,n);break;case 3:da(e,n,s,l),f&2048&&(e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&cr(e)));break;case 12:if(f&2048){da(e,n,s,l),e=n.stateNode;try{var h=n.memoizedProps,C=h.id,z=h.onPostCommit;typeof z=="function"&&z(C,n.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(Y){Dt(n,n.return,Y)}}else da(e,n,s,l);break;case 23:break;case 22:h=n.stateNode,n.memoizedState!==null?h._visibility&4?da(e,n,s,l):dr(e,n):h._visibility&4?da(e,n,s,l):(h._visibility|=4,ls(e,n,s,l,(n.subtreeFlags&10256)!==0)),f&2048&&ql(n.alternate,n);break;case 24:da(e,n,s,l),f&2048&&kl(n.alternate,n);break;default:da(e,n,s,l)}}function ls(e,n,s,l,f){for(f=f&&(n.subtreeFlags&10256)!==0,n=n.child;n!==null;){var h=e,C=n,z=s,Y=l,re=C.flags;switch(C.tag){case 0:case 11:case 15:ls(h,C,z,Y,f),fr(8,C);break;case 23:break;case 22:var _e=C.stateNode;C.memoizedState!==null?_e._visibility&4?ls(h,C,z,Y,f):dr(h,C):(_e._visibility|=4,ls(h,C,z,Y,f)),f&&re&2048&&ql(C.alternate,C);break;case 24:ls(h,C,z,Y,f),f&&re&2048&&kl(C.alternate,C);break;default:ls(h,C,z,Y,f)}n=n.sibling}}function dr(e,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var s=e,l=n,f=l.flags;switch(l.tag){case 22:dr(s,l),f&2048&&ql(l.alternate,l);break;case 24:dr(s,l),f&2048&&kl(l.alternate,l);break;default:dr(s,l)}n=n.sibling}}function Fa(e){if(e.subtreeFlags&Us)for(e=e.child;e!==null;)td(e),e=e.sibling}function td(e){switch(e.tag){case 26:Fa(e),e.flags&Us&&(e.memoizedState!==null?hg(Ci,e.memoizedState,e.memoizedProps):Fd(e.type,e.memoizedProps));break;case 5:Fa(e),e.flags&Us&&Fd(e.type,e.memoizedProps);break;case 3:case 4:if(li){var n=Ci;Ci=_c(e.stateNode.containerInfo),Fa(e),Ci=n}else Fa(e);break;case 22:e.memoizedState===null&&(n=e.alternate,n!==null&&n.memoizedState!==null?(n=Us,Us=16777216,Fa(e),Us=n):Fa(e));break;default:Fa(e)}}function nd(e){var n=e.alternate;if(n!==null&&(e=n.child,e!==null)){n.child=null;do n=e.sibling,e.sibling=null,e=n;while(e!==null)}}function pr(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var s=0;s<n.length;s++){var l=n[s];fn=l,ad(l,e)}nd(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)id(e),e=e.sibling}function id(e){switch(e.tag){case 0:case 11:case 15:pr(e),e.flags&2048&&ua(9,e,e.return);break;case 3:pr(e);break;case 12:pr(e);break;case 22:var n=e.stateNode;e.memoizedState!==null&&n._visibility&4&&(e.return===null||e.return.tag!==13)?(n._visibility&=-5,ro(e)):pr(e);break;default:pr(e)}}function ro(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var s=0;s<n.length;s++){var l=n[s];fn=l,ad(l,e)}nd(e)}for(e=e.child;e!==null;){switch(n=e,n.tag){case 0:case 11:case 15:ua(8,n,n.return),ro(n);break;case 22:s=n.stateNode,s._visibility&4&&(s._visibility&=-5,ro(n));break;default:ro(n)}e=e.sibling}}function ad(e,n){for(;fn!==null;){var s=fn;switch(s.tag){case 0:case 11:case 15:ua(8,s,n);break;case 23:case 22:if(s.memoizedState!==null&&s.memoizedState.cachePool!==null){var l=s.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:cr(s.memoizedState.cache)}if(l=s.child,l!==null)l.return=s,fn=l;else e:for(s=e;fn!==null;){l=fn;var f=l.sibling,h=l.return;if(Zf(l),l===s){fn=null;break e}if(f!==null){f.return=h,fn=f;break e}fn=h}}}function Yl(e){var n=Od(e);if(n!=null){if(typeof n.memoizedProps["data-testname"]!="string")throw Error(o(364));return n}if(e=yv(e),e===null)throw Error(o(362));return e.stateNode.current}function Kl(e,n){var s=e.tag;switch(n.$$typeof){case Ro:if(e.type===n.value)return!0;break;case bo:e:{for(n=n.value,e=[e,0],s=0;s<e.length;){var l=e[s++],f=l.tag,h=e[s++],C=n[h];if(f!==5&&f!==26&&f!==27||!vr(l)){for(;C!=null&&Kl(l,C);)h++,C=n[h];if(h===n.length){n=!0;break e}else for(l=l.child;l!==null;)e.push(l,h),l=l.sibling}}n=!1}return n;case Uo:if((s===5||s===26||s===27)&&Rv(e.stateNode,n.value))return!0;break;case Do:if((s===5||s===6||s===26||s===27)&&(e=Av(e),e!==null&&0<=e.indexOf(n.value)))return!0;break;case Co:if((s===5||s===26||s===27)&&(e=e.memoizedProps["data-testname"],typeof e=="string"&&e.toLowerCase()===n.value.toLowerCase()))return!0;break;default:throw Error(o(365))}return!1}function Ql(e){switch(e.$$typeof){case Ro:return"<"+(u(e.value)||"Unknown")+">";case bo:return":has("+(Ql(e)||"")+")";case Uo:return'[role="'+e.value+'"]';case Do:return'"'+e.value+'"';case Co:return'[data-testname="'+e.value+'"]';default:throw Error(o(365))}}function sd(e,n){var s=[];e=[e,0];for(var l=0;l<e.length;){var f=e[l++],h=f.tag,C=e[l++],z=n[C];if(h!==5&&h!==26&&h!==27||!vr(f)){for(;z!=null&&Kl(f,z);)C++,z=n[C];if(C===n.length)s.push(f);else for(f=f.child;f!==null;)e.push(f,C),f=f.sibling}}return s}function Zl(e,n){if(!mr)throw Error(o(363));e=Yl(e),e=sd(e,n),n=[],e=Array.from(e);for(var s=0;s<e.length;){var l=e[s++],f=l.tag;if(f===5||f===26||f===27)vr(l)||n.push(l.stateNode);else for(l=l.child;l!==null;)e.push(l),l=l.sibling}return n}function Zn(){if((Nt&2)!==0&&_t!==0)return _t&-_t;if(tt.T!==null){var e=Ts;return e!==0?e:fe()}return hv()}function rd(){pi===0&&(pi=(_t&536870912)===0||Tt?I():536870912);var e=di.current;return e!==null&&(e.flags|=32),pi}function Pn(e,n,s){(e===Ot&&It===2||e.cancelPendingCommit!==null)&&(cs(e,0),ki(e,_t,pi,!1)),L(e,s),((Nt&2)===0||e!==Ot)&&(e===Ot&&((Nt&2)===0&&(Za|=s),jt===4&&ki(e,_t,pi,!1)),ke(e))}function od(e,n,s){if((Nt&6)!==0)throw Error(o(327));var l=!s&&(n&60)===0&&(n&e.expiredLanes)===0||N(e,n),f=l?Wm(e,n):ec(e,n,!0),h=l;do{if(f===0){Cs&&!l&&ki(e,n,0,!1);break}else if(f===6)ki(e,n,0,!Ji);else{if(s=e.current.alternate,h&&!Vm(s)){f=ec(e,n,!1),h=!1;continue}if(f===2){if(h=n,e.errorRecoveryDisabledLanes&h)var C=0;else C=e.pendingLanes&-536870913,C=C!==0?C:C&536870912?536870912:0;if(C!==0){n=C;e:{var z=e;f=xr;var Y=oi&&z.current.memoizedState.isDehydrated;if(Y&&(cs(z,C).flags|=256),C=ec(z,C,!1),C!==2){if(Nc&&!Y){z.errorRecoveryDisabledLanes|=h,Za|=h,f=4;break e}h=Bi,Bi=f,h!==null&&jl(h)}f=C}if(h=!1,f!==2)continue}}if(f===1){cs(e,0),ki(e,n,0,!0);break}e:{switch(l=e,f){case 0:case 1:throw Error(o(345));case 4:if((n&4194176)===n){ki(l,n,pi,!Ji);break e}break;case 2:Bi=null;break;case 3:case 5:break;default:throw Error(o(329))}if(l.finishedWork=s,l.finishedLanes=n,(n&62914560)===n&&(h=Oc+300-bi(),10<h)){if(ki(l,n,pi,!Ji),P(l,0)!==0)break e;l.timeoutHandle=fv(ld.bind(null,l,s,Bi,wo,Bc,n,pi,Za,Ds,Ji,2,-0,0),h);break e}ld(l,s,Bi,wo,Bc,n,pi,Za,Ds,Ji,0,-0,0)}}break}while(!0);ke(e)}function jl(e){Bi===null?Bi=e:Bi.push.apply(Bi,e)}function ld(e,n,s,l,f,h,C,z,Y,re,_e,Re,be){var nt=n.subtreeFlags;if((nt&8192||(nt&16785408)===16785408)&&(_v(),td(n),n=Sv(),n!==null)){e.cancelPendingCommit=n(gd.bind(null,e,s,l,f,C,z,Y,1,Re,be)),ki(e,h,C,!re);return}gd(e,s,l,f,C,z,Y,_e,Re,be)}function Vm(e){for(var n=e;;){var s=n.tag;if((s===0||s===11||s===15)&&n.flags&16384&&(s=n.updateQueue,s!==null&&(s=s.stores,s!==null)))for(var l=0;l<s.length;l++){var f=s[l],h=f.getSnapshot;f=f.value;try{if(!ei(h(),f))return!1}catch{return!1}}if(s=n.child,n.subtreeFlags&16384&&s!==null)s.return=n,n=s;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function ki(e,n,s,l){n&=~Lc,n&=~Za,e.suspendedLanes|=n,e.pingedLanes&=~n,l&&(e.warmLanes|=n),l=e.expirationTimes;for(var f=n;0<f;){var h=31-Jn(f),C=1<<h;l[h]=-1,f&=~C}s!==0&&W(e,s,n)}function cd(){return(Nt&6)===0?(Ft(0),!1):!0}function Jl(){if(pt!==null){if(It===0)var e=pt.return;else e=pt,Zi=Ka=null,D(e),xs=null,Tr=0,e=pt;for(;e!==null;)Vf(e.alternate,e),e=e.return;pt=null}}function cs(e,n){e.finishedWork=null,e.finishedLanes=0;var s=e.timeoutHandle;s!==mc&&(e.timeoutHandle=mc,dv(s)),s=e.cancelPendingCommit,s!==null&&(e.cancelPendingCommit=null,s()),Jl(),Ot=e,pt=s=pa(e.current,null),_t=n,It=0,ni=null,Ji=!1,Cs=N(e,n),Nc=!1,Ds=pi=Lc=Za=Ta=jt=0,Bi=xr=null,Bc=!1,(n&8)!==0&&(n|=n&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=n;0<l;){var f=31-Jn(l),h=1<<f;n|=e[f],l&=~h}return $i=n,Ct(),s}function ud(e,n){ut=null,tt.H=Li,n===Er?(n=Le(),It=3):n===Uc?(n=Le(),It=4):It=n===op?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,ni=n,pt===null&&(jt=1,eo(e,de(n,e.current)))}function fd(){var e=di.current;return e===null?!0:(_t&4194176)===_t?Ni===null:(_t&62914560)===_t||(_t&536870912)!==0?e===Ni:!1}function dd(){var e=tt.H;return tt.H=Li,e===null?Li:e}function pd(){var e=tt.A;return tt.A=wg,e}function $l(){jt=4,Ji||(_t&4194176)!==_t&&di.current!==null||(Cs=!0),(Ta&134217727)===0&&(Za&134217727)===0||Ot===null||ki(Ot,_t,pi,!1)}function ec(e,n,s){var l=Nt;Nt|=2;var f=dd(),h=pd();(Ot!==e||_t!==n)&&(wo=null,cs(e,n)),n=!1;var C=jt;e:do try{if(It!==0&&pt!==null){var z=pt,Y=ni;switch(It){case 8:Jl(),C=6;break e;case 3:case 2:case 6:di.current===null&&(n=!0);var re=It;if(It=0,ni=null,us(e,z,Y,re),s&&Cs){C=0;break e}break;default:re=It,It=0,ni=null,us(e,z,Y,re)}}Xm(),C=jt;break}catch(_e){ud(e,_e)}while(!0);return n&&e.shellSuspendCounter++,Zi=Ka=null,Nt=l,tt.H=f,tt.A=h,pt===null&&(Ot=null,_t=0,Ct()),C}function Xm(){for(;pt!==null;)hd(pt)}function Wm(e,n){var s=Nt;Nt|=2;var l=dd(),f=pd();Ot!==e||_t!==n?(wo=null,Ar=bi()+500,cs(e,n)):Cs=N(e,n);e:do try{if(It!==0&&pt!==null){n=pt;var h=ni;t:switch(It){case 1:It=0,ni=null,us(e,n,h,1);break;case 2:if(we(h)){It=0,ni=null,md(n);break}n=function(){It===2&&Ot===e&&(It=7),ke(e)},h.then(n,n);break e;case 3:It=7;break e;case 4:It=5;break e;case 7:we(h)?(It=0,ni=null,md(n)):(It=0,ni=null,us(e,n,h,7));break;case 5:var C=null;switch(pt.tag){case 26:C=pt.memoizedState;case 5:case 27:var z=pt,Y=z.type,re=z.pendingProps;if(C?ep(C):Id(Y,re)){It=0,ni=null;var _e=z.sibling;if(_e!==null)pt=_e;else{var Re=z.return;Re!==null?(pt=Re,oo(Re)):pt=null}break t}}It=0,ni=null,us(e,n,h,5);break;case 6:It=0,ni=null,us(e,n,h,6);break;case 8:Jl(),jt=6;break e;default:throw Error(o(462))}}qm();break}catch(be){ud(e,be)}while(!0);return Zi=Ka=null,tt.H=l,tt.A=f,Nt=s,pt!==null?0:(Ot=null,_t=0,Ct(),jt)}function qm(){for(;pt!==null&&!Eg();)hd(pt)}function hd(e){var n=Bf(e.alternate,e,$i);e.memoizedProps=e.pendingProps,n===null?oo(e):pt=n}function md(e){var n=e,s=n.alternate;switch(n.tag){case 15:case 0:n=Cf(s,n,n.pendingProps,n.type,void 0,_t);break;case 11:n=Cf(s,n,n.pendingProps,n.type.render,n.ref,_t);break;case 5:D(n);default:Vf(s,n),n=pt=Td(n,$i),n=Bf(s,n,$i)}e.memoizedProps=e.pendingProps,n===null?oo(e):pt=n}function us(e,n,s,l){Zi=Ka=null,D(n),xs=null,Tr=0;var f=n.return;try{if(Om(e,f,n,s,_t)){jt=1,eo(e,de(s,e.current)),pt=null;return}}catch(h){if(f!==null)throw pt=f,h;jt=1,eo(e,de(s,e.current)),pt=null;return}n.flags&32768?(Tt||l===1?e=!0:Cs||(_t&536870912)!==0?e=!1:(Ji=e=!0,(l===2||l===3||l===6)&&(l=di.current,l!==null&&l.tag===13&&(l.flags|=16384))),vd(n,e)):oo(n)}function oo(e){var n=e;do{if((n.flags&32768)!==0){vd(n,Ji);return}e=n.return;var s=Fm(n.alternate,n,$i);if(s!==null){pt=s;return}if(n=n.sibling,n!==null){pt=n;return}pt=n=e}while(n!==null);jt===0&&(jt=5)}function vd(e,n){do{var s=Hm(e.alternate,e);if(s!==null){s.flags&=32767,pt=s;return}if(s=e.return,s!==null&&(s.flags|=32768,s.subtreeFlags=0,s.deletions=null),!n&&(e=e.sibling,e!==null)){pt=e;return}pt=e=s}while(e!==null);jt=6,pt=null}function gd(e,n,s,l,f,h,C,z,Y,re){var _e=tt.T,Re=Ga();try{Hn(2),tt.T=null,km(e,n,s,l,Re,f,h,C,z,Y,re)}finally{tt.T=_e,Hn(Re)}}function km(e,n,s,l,f,h,C,z){do Ha();while(ja!==null);if((Nt&6)!==0)throw Error(o(327));var Y=e.finishedWork;if(l=e.finishedLanes,Y===null)return null;if(e.finishedWork=null,e.finishedLanes=0,Y===e.current)throw Error(o(177));e.callbackNode=null,e.callbackPriority=0,e.cancelPendingCommit=null;var re=Y.lanes|Y.childLanes;if(re|=yc,F(e,l,re,h,C,z),e===Ot&&(pt=Ot=null,_t=0),(Y.subtreeFlags&10256)===0&&(Y.flags&10256)===0||Po||(Po=!0,Ic=re,Fc=s,Zm(Tc,function(){return Ha(),null})),s=(Y.flags&15990)!==0,(Y.subtreeFlags&15990)!==0||s?(s=tt.T,tt.T=null,h=Ga(),Hn(2),C=Nt,Nt|=4,zm(e,Y),Jf(Y,e),cv(e.containerInfo),e.current=Y,Qf(e,Y.alternate,Y),Tg(),Nt=C,Hn(h),tt.T=s):e.current=Y,Po?(Po=!1,ja=e,Rr=l):_d(e,re),re=e.pendingLanes,re===0&&(Ma=null),G(Y.stateNode),ke(e),n!==null)for(f=e.onRecoverableError,Y=0;Y<n.length;Y++)re=n[Y],f(re.value,{componentStack:re.stack});return(Rr&3)!==0&&Ha(),re=e.pendingLanes,(l&4194218)!==0&&(re&42)!==0?e===Hc?br++:(br=0,Hc=e):br=0,Ft(0),null}function _d(e,n){(e.pooledCacheLanes&=n)===0&&(n=e.pooledCache,n!=null&&(e.pooledCache=null,cr(n)))}function Ha(){if(ja!==null){var e=ja,n=Ic;Ic=0;var s=te(Rr),l=32>s?32:s;s=tt.T;var f=Ga();try{if(Hn(l),tt.T=null,ja===null)var h=!1;else{l=Fc,Fc=null;var C=ja,z=Rr;if(ja=null,Rr=0,(Nt&6)!==0)throw Error(o(331));var Y=Nt;if(Nt|=4,id(C.current),ed(C,C.current,z,l),Nt=Y,Ft(0,!1),$n&&typeof $n.onPostCommitFiberRoot=="function")try{$n.onPostCommitFiberRoot(gr,C)}catch{}h=!0}return h}finally{Hn(f),tt.T=s,_d(e,n)}}return!1}function Sd(e,n,s){n=de(s,n),n=Al(e.stateNode,n,2),e=Me(e,n,2),e!==null&&(L(e,2),ke(e))}function Dt(e,n,s){if(e.tag===3)Sd(e,e,s);else for(;n!==null;){if(n.tag===3){Sd(n,e,s);break}else if(n.tag===1){var l=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Ma===null||!Ma.has(l))){e=de(s,e),s=Mf(2),l=Me(n,s,2),l!==null&&(yf(s,l,n,e),L(l,2),ke(l));break}}n=n.return}}function tc(e,n,s){var l=e.pingCache;if(l===null){l=e.pingCache=new Pg;var f=new Set;l.set(n,f)}else f=l.get(n),f===void 0&&(f=new Set,l.set(n,f));f.has(s)||(Nc=!0,f.add(s),e=Ym.bind(null,e,n,s),n.then(e,e))}function Ym(e,n,s){var l=e.pingCache;l!==null&&l.delete(n),e.pingedLanes|=e.suspendedLanes&s,e.warmLanes&=~s,Ot===e&&(_t&s)===s&&(jt===4||jt===3&&(_t&62914560)===_t&&300>bi()-Oc?(Nt&2)===0&&cs(e,0):Lc|=s,Ds===_t&&(Ds=0)),ke(e)}function Ed(e,n){n===0&&(n=y()),e=De(e,n),e!==null&&(L(e,n),ke(e))}function Km(e){var n=e.memoizedState,s=0;n!==null&&(s=n.retryLane),Ed(e,s)}function Qm(e,n){var s=0;switch(e.tag){case 13:var l=e.stateNode,f=e.memoizedState;f!==null&&(s=f.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(o(314))}l!==null&&l.delete(n),Ed(e,s)}function Zm(e,n){return mo(e,n)}function jm(e,n,s,l){this.tag=e,this.key=s,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function nc(e){return e=e.prototype,!(!e||!e.isReactComponent)}function pa(e,n){var s=e.alternate;return s===null?(s=a(e.tag,n,e.key,e.mode),s.elementType=e.elementType,s.type=e.type,s.stateNode=e.stateNode,s.alternate=e,e.alternate=s):(s.pendingProps=n,s.type=e.type,s.flags=0,s.subtreeFlags=0,s.deletions=null),s.flags=e.flags&31457280,s.childLanes=e.childLanes,s.lanes=e.lanes,s.child=e.child,s.memoizedProps=e.memoizedProps,s.memoizedState=e.memoizedState,s.updateQueue=e.updateQueue,n=e.dependencies,s.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},s.sibling=e.sibling,s.index=e.index,s.ref=e.ref,s.refCleanup=e.refCleanup,s}function Td(e,n){e.flags&=31457282;var s=e.alternate;return s===null?(e.childLanes=0,e.lanes=n,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=s.childLanes,e.lanes=s.lanes,e.child=s.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=s.memoizedProps,e.memoizedState=s.memoizedState,e.updateQueue=s.updateQueue,e.type=s.type,n=s.dependencies,e.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),e}function lo(e,n,s,l,f,h){var C=0;if(l=e,typeof e=="function")nc(e)&&(C=1);else if(typeof e=="string")C=li&&Mn?Kd(e,s,mn.current)?26:np(e)?27:5:li?Kd(e,s,mn.current)?26:5:Mn&&np(e)?27:5;else e:switch(e){case ds:return za(s.children,f,h,n);case Ud:C=8,f|=24;break;case oc:return e=a(12,s,n,f|2),e.elementType=oc,e.lanes=h,e;case cc:return e=a(13,s,n,f),e.elementType=cc,e.lanes=h,e;case uc:return e=a(19,s,n,f),e.elementType=uc,e.lanes=h,e;case Dd:return Md(s,f,h,n);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case tv:case ha:C=10;break e;case Cd:C=9;break e;case lc:C=11;break e;case fc:C=14;break e;case ma:C=16,l=null;break e}C=29,s=Error(o(130,e===null?"null":typeof e,"")),l=null}return n=a(C,s,n,f),n.elementType=e,n.type=l,n.lanes=h,n}function za(e,n,s,l){return e=a(7,e,l,n),e.lanes=s,e}function Md(e,n,s,l){e=a(22,e,l,n),e.elementType=Dd,e.lanes=s;var f={_visibility:1,_pendingVisibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null,_current:null,detach:function(){var h=f._current;if(h===null)throw Error(o(456));if((f._pendingVisibility&2)===0){var C=De(h,2);C!==null&&(f._pendingVisibility|=2,Pn(C,h,2))}},attach:function(){var h=f._current;if(h===null)throw Error(o(456));if((f._pendingVisibility&2)!==0){var C=De(h,2);C!==null&&(f._pendingVisibility&=-3,Pn(C,h,2))}}};return e.stateNode=f,e}function ic(e,n,s){return e=a(6,e,null,n),e.lanes=s,e}function ac(e,n,s){return n=a(4,e.children!==null?e.children:[],e.key,n),n.lanes=s,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}function Jm(e,n,s,l,f,h,C,z){this.tag=1,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=mc,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=M(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.finishedLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=M(0),this.hiddenUpdates=M(null),this.identifierPrefix=l,this.onUncaughtError=f,this.onCaughtError=h,this.onRecoverableError=C,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=z,this.incompleteTransitions=new Map}function yd(e,n,s,l,f,h,C,z,Y,re,_e,Re){return e=new Jm(e,n,s,C,z,Y,re,Re),n=1,h===!0&&(n|=24),h=a(3,null,null,n),e.current=h,h.stateNode=e,n=Ol(),n.refCount++,e.pooledCache=n,n.refCount++,h.memoizedState={element:l,isDehydrated:s,cache:n},Be(h),e}function xd(e){return e?(e=ms,e):ms}function Ad(e){var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(o(188)):(e=Object.keys(e).join(","),Error(o(268,e)));return e=S(n),e=e!==null?U(e):null,e===null?null:hr(e.stateNode)}function Rd(e,n,s,l,f,h){f=xd(f),l.context===null?l.context=f:l.pendingContext=f,l=pe(n),l.payload={element:s},h=h===void 0?null:h,h!==null&&(l.callback=h),s=Me(e,l,n),s!==null&&(Pn(s,e,n),Ve(s,e,n))}function bd(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var s=e.retryLane;e.retryLane=s!==0&&s<n?s:n}}function sc(e,n){bd(e,n),(e=e.alternate)&&bd(e,n)}var dt={},$m=Og(),jn=_m(),rc=Object.assign,ev=Symbol.for("react.element"),co=Symbol.for("react.transitional.element"),fs=Symbol.for("react.portal"),ds=Symbol.for("react.fragment"),Ud=Symbol.for("react.strict_mode"),oc=Symbol.for("react.profiler"),tv=Symbol.for("react.provider"),Cd=Symbol.for("react.consumer"),ha=Symbol.for("react.context"),lc=Symbol.for("react.forward_ref"),cc=Symbol.for("react.suspense"),uc=Symbol.for("react.suspense_list"),fc=Symbol.for("react.memo"),ma=Symbol.for("react.lazy"),Dd=Symbol.for("react.offscreen"),nv=Symbol.for("react.memo_cache_sentinel"),wd=Symbol.iterator,iv=Symbol.for("react.client.reference"),tt=$m.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,dc,Pd,pc=!1,uo=Array.isArray,av=i.rendererVersion,sv=i.rendererPackageName,Nd=i.extraDevToolsConfig,hr=i.getPublicInstance,rv=i.getRootHostContext,ov=i.getChildHostContext,lv=i.prepareForCommit,cv=i.resetAfterCommit,uv=i.createInstance,hc=i.appendInitialChild,Ld=i.finalizeInitialChildren,fo=i.shouldSetTextContent,Bd=i.createTextInstance,fv=i.scheduleTimeout,dv=i.cancelTimeout,mc=i.noTimeout,Yi=i.isPrimaryRenderer;i.warnsIfNotActing;var Tn=i.supportsMutation,va=i.supportsPersistence,oi=i.supportsHydration,Od=i.getInstanceFromNode;i.beforeActiveInstanceBlur,i.afterActiveInstanceBlur;var pv=i.preparePortalMount;i.prepareScopeUpdate,i.getInstanceFromScope;var Hn=i.setCurrentUpdatePriority,Ga=i.getCurrentUpdatePriority,hv=i.resolveUpdatePriority;i.resolveEventType,i.resolveEventTimeStamp;var mv=i.shouldAttemptEagerTransition,vv=i.detachDeletedInstance;i.requestPostPaintCallback;var gv=i.maySuspendCommit,Id=i.preloadInstance,_v=i.startSuspendingCommit,Fd=i.suspendInstance,Sv=i.waitForCommitToBeReady,ps=i.NotPendingTransition,Va=i.HostTransitionContext,Ev=i.resetFormInstance;i.bindToConsole;var Tv=i.supportsMicrotasks,Mv=i.scheduleMicrotask,mr=i.supportsTestSelectors,yv=i.findFiberRoot,xv=i.getBoundingRect,Av=i.getTextContent,vr=i.isHiddenSubtree,Rv=i.matchAccessibilityRole,bv=i.setFocusIfFocusable,Uv=i.setupIntersectionObserver,Cv=i.appendChild,Dv=i.appendChildToContainer,wv=i.commitTextUpdate,Pv=i.commitMount,Nv=i.commitUpdate,Lv=i.insertBefore,Bv=i.insertInContainerBefore,Ov=i.removeChild,Iv=i.removeChildFromContainer,Hd=i.resetTextContent,Fv=i.hideInstance,Hv=i.hideTextInstance,zv=i.unhideInstance,Gv=i.unhideTextInstance,Vv=i.clearContainer,Xv=i.cloneInstance,zd=i.createContainerChildSet,Gd=i.appendChildToContainerChildSet,Wv=i.finalizeContainerChildren,Vd=i.replaceContainerChildren,Xd=i.cloneHiddenInstance,Wd=i.cloneHiddenTextInstance,vc=i.isSuspenseInstancePending,gc=i.isSuspenseInstanceFallback,qv=i.getSuspenseInstanceFallbackErrorDetails,kv=i.registerSuspenseInstanceRetry,Yv=i.canHydrateFormStateMarker,Kv=i.isFormStateMarkerMatching,qd=i.getNextHydratableSibling,kd=i.getFirstHydratableChild,Qv=i.getFirstHydratableChildWithinContainer,Zv=i.getFirstHydratableChildWithinSuspenseInstance,jv=i.canHydrateInstance,Jv=i.canHydrateTextInstance,$v=i.canHydrateSuspenseInstance,eg=i.hydrateInstance,tg=i.hydrateTextInstance,ng=i.hydrateSuspenseInstance,ig=i.getNextHydratableInstanceAfterSuspenseInstance,ag=i.commitHydratedContainer,sg=i.commitHydratedSuspenseInstance,rg=i.clearSuspenseBoundary,og=i.clearSuspenseBoundaryFromContainer,Yd=i.shouldDeleteUnhydratedTailInstances;i.diffHydratedPropsForDevWarnings,i.diffHydratedTextForDevWarnings,i.describeHydratableInstanceForDevWarnings;var lg=i.validateHydratableInstance,cg=i.validateHydratableTextInstance,li=i.supportsResources,Kd=i.isHostHoistableType,_c=i.getHoistableRoot,Qd=i.getResource,Zd=i.acquireResource,jd=i.releaseResource,ug=i.hydrateHoistable,Jd=i.mountHoistable,$d=i.unmountHoistable,fg=i.createHoistableInstance,dg=i.prepareToCommitHoistables,pg=i.mayResourceSuspendCommit,ep=i.preloadResource,hg=i.suspendResource,Mn=i.supportsSingletons,tp=i.resolveSingletonInstance,mg=i.clearSingleton,vg=i.acquireSingletonInstance,gg=i.releaseSingletonInstance,np=i.isHostSingletonType,Sc=[],hs=-1,ms={},Jn=Math.clz32?Math.clz32:R,_g=Math.log,Sg=Math.LN2,po=128,ho=4194304,mo=jn.unstable_scheduleCallback,Ec=jn.unstable_cancelCallback,Eg=jn.unstable_shouldYield,Tg=jn.unstable_requestPaint,bi=jn.unstable_now,ip=jn.unstable_ImmediatePriority,Mg=jn.unstable_UserBlockingPriority,Tc=jn.unstable_NormalPriority,yg=jn.unstable_IdlePriority,xg=jn.log,Ag=jn.unstable_setDisableYieldValue,gr=null,$n=null,ei=typeof Object.is=="function"?Object.is:K,ap=new WeakMap,vs=[],gs=0,vo=null,go=0,ci=[],ui=0,Xa=null,Ki=1,Qi="",mn=T(null),_r=T(null),ga=T(null),_o=T(null),Nn=null,yn=null,Tt=!1,Ui=null,Pi=!1,Mc=Error(o(519)),fi=[],_s=0,yc=0,So=null,Ss=null,xc=!1,Eo=!1,Ac=!1,Es=0,Sr=null,Rc=0,Ts=0,Ms=null,_a=!1,bc=!1,Rg=Object.prototype.hasOwnProperty,Er=Error(o(460)),Uc=Error(o(474)),To={then:function(){}},ys=null,xs=null,Tr=0,Wa=qn(!0),sp=qn(!1),As=T(null),Mo=T(0),di=T(null),Ni=null,sn=T(0),Sa=0,ut=null,Pt=null,en=null,yo=!1,Rs=!1,qa=!1,xo=0,Mr=0,bs=null,bg=0,Cc=function(){return{lastEffect:null,events:null,stores:null,memoCache:null}},Li={readContext:En,use:k,useCallback:qt,useContext:qt,useEffect:qt,useImperativeHandle:qt,useLayoutEffect:qt,useInsertionEffect:qt,useMemo:qt,useReducer:qt,useRef:qt,useState:qt,useDebugValue:qt,useDeferredValue:qt,useTransition:qt,useSyncExternalStore:qt,useId:qt};Li.useCacheRefresh=qt,Li.useMemoCache=qt,Li.useHostTransitionStatus=qt,Li.useFormState=qt,Li.useActionState=qt,Li.useOptimistic=qt;var ka={readContext:En,use:k,useCallback:function(e,n){return X().memoizedState=[e,n===void 0?null:n],e},useContext:En,useEffect:af,useImperativeHandle:function(e,n,s){s=s!=null?s.concat([e]):null,jr(4194308,4,of.bind(null,n,e),s)},useLayoutEffect:function(e,n){return jr(4194308,4,e,n)},useInsertionEffect:function(e,n){jr(4,2,e,n)},useMemo:function(e,n){var s=X();n=n===void 0?null:n;var l=e();if(qa){ne(!0);try{e()}finally{ne(!1)}}return s.memoizedState=[l,n],l},useReducer:function(e,n,s){var l=X();if(s!==void 0){var f=s(n);if(qa){ne(!0);try{s(n)}finally{ne(!1)}}}else f=n;return l.memoizedState=l.baseState=f,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:f},l.queue=e,e=e.dispatch=Bm.bind(null,ut,e),[l.memoizedState,e]},useRef:function(e){var n=X();return e={current:e},n.memoizedState=e},useState:function(e){e=bt(e);var n=e.queue,s=vf.bind(null,ut,n);return n.dispatch=s,[e.memoizedState,s]},useDebugValue:El,useDeferredValue:function(e,n){var s=X();return Tl(s,e,n)},useTransition:function(){var e=bt(!1);return e=df.bind(null,ut,e.queue,!0,!1),X().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,n,s){var l=ut,f=X();if(Tt){if(s===void 0)throw Error(o(407));s=s()}else{if(s=n(),Ot===null)throw Error(o(349));(_t&60)!==0||ze(l,n,s)}f.memoizedState=s;var h={value:s,getSnapshot:n};return f.queue=h,af(Rt.bind(null,l,h,e),[e]),l.flags|=2048,In(9,ct.bind(null,l,h,s,n),{destroy:void 0},null),s},useId:function(){var e=X(),n=Ot.identifierPrefix;if(Tt){var s=Qi,l=Ki;s=(l&~(1<<32-Jn(l)-1)).toString(32)+s,n=":"+n+"R"+s,s=xo++,0<s&&(n+="H"+s.toString(32)),n+=":"}else s=bg++,n=":"+n+"r"+s.toString(32)+":";return e.memoizedState=n},useCacheRefresh:function(){return X().memoizedState=Lm.bind(null,ut)}};ka.useMemoCache=me,ka.useHostTransitionStatus=Ml,ka.useFormState=Dn,ka.useActionState=Dn,ka.useOptimistic=function(e){var n=X();n.memoizedState=n.baseState=e;var s={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=s,n=yl.bind(null,ut,!0,s),s.dispatch=n,[e,n]};var Ea={readContext:En,use:k,useCallback:cf,useContext:En,useEffect:Sl,useImperativeHandle:lf,useInsertionEffect:sf,useLayoutEffect:rf,useMemo:uf,useReducer:Pe,useRef:nf,useState:function(){return Pe(Te)},useDebugValue:El,useDeferredValue:function(e,n){var s=Z();return ff(s,Pt.memoizedState,e,n)},useTransition:function(){var e=Pe(Te)[0],n=Z().memoizedState;return[typeof e=="boolean"?e:$(e),n]},useSyncExternalStore:Ke,useId:hf};Ea.useCacheRefresh=mf,Ea.useMemoCache=me,Ea.useHostTransitionStatus=Ml,Ea.useFormState=wn,Ea.useActionState=wn,Ea.useOptimistic=function(e,n){var s=Z();return Xe(s,Pt,e,n)};var Ya={readContext:En,use:k,useCallback:cf,useContext:En,useEffect:Sl,useImperativeHandle:lf,useInsertionEffect:sf,useLayoutEffect:rf,useMemo:uf,useReducer:We,useRef:nf,useState:function(){return We(Te)},useDebugValue:El,useDeferredValue:function(e,n){var s=Z();return Pt===null?Tl(s,e,n):ff(s,Pt.memoizedState,e,n)},useTransition:function(){var e=We(Te)[0],n=Z().memoizedState;return[typeof e=="boolean"?e:$(e),n]},useSyncExternalStore:Ke,useId:hf};Ya.useCacheRefresh=mf,Ya.useMemoCache=me,Ya.useHostTransitionStatus=Ml,Ya.useFormState=rs,Ya.useActionState=rs,Ya.useOptimistic=function(e,n){var s=Z();return Pt!==null?Xe(s,Pt,e,n):(s.baseState=e,[e,s.queue.dispatch])};var Dc={isMounted:function(e){return(e=e._reactInternals)?_(e)===e:!1},enqueueSetState:function(e,n,s){e=e._reactInternals;var l=Zn(),f=pe(l);f.payload=n,s!=null&&(f.callback=s),n=Me(e,f,l),n!==null&&(Pn(n,e,l),Ve(n,e,l))},enqueueReplaceState:function(e,n,s){e=e._reactInternals;var l=Zn(),f=pe(l);f.tag=1,f.payload=n,s!=null&&(f.callback=s),n=Me(e,f,l),n!==null&&(Pn(n,e,l),Ve(n,e,l))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var s=Zn(),l=pe(s);l.tag=2,n!=null&&(l.callback=n),n=Me(e,l,s),n!==null&&(Pn(n,e,s),Ve(n,e,s))}},rp=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},op=Error(o(461)),un=!1,wc={dehydrated:null,treeContext:null,retryLane:0},Ao=T(null),Ka=null,Zi=null,Ug=typeof AbortController<"u"?AbortController:function(){var e=[],n=this.signal={aborted:!1,addEventListener:function(s,l){e.push(l)}};this.abort=function(){n.aborted=!0,e.forEach(function(s){return s()})}},Cg=jn.unstable_scheduleCallback,Dg=jn.unstable_NormalPriority,Qt={$$typeof:ha,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0},lp=tt.S;tt.S=function(e,n){typeof n=="object"&&n!==null&&typeof n.then=="function"&&ae(e,n),lp!==null&&lp(e,n)};var Qa=T(null),ji=!1,Zt=!1,Pc=!1,cp=typeof WeakSet=="function"?WeakSet:Set,fn=null,up=!1,tn=null,ti=!1,Ci=null,Us=8192,wg={getCacheForType:function(e){var n=En(Qt),s=n.data.get(e);return s===void 0&&(s=e(),n.data.set(e,s)),s}},Ro=0,bo=1,Uo=2,Co=3,Do=4;if(typeof Symbol=="function"&&Symbol.for){var yr=Symbol.for;Ro=yr("selector.component"),bo=yr("selector.has_pseudo_class"),Uo=yr("selector.role"),Co=yr("selector.test_id"),Do=yr("selector.text")}var Pg=typeof WeakMap=="function"?WeakMap:Map,Nt=0,Ot=null,pt=null,_t=0,It=0,ni=null,Ji=!1,Cs=!1,Nc=!1,$i=0,jt=0,Ta=0,Za=0,Lc=0,pi=0,Ds=0,xr=null,Bi=null,Bc=!1,Oc=0,Ar=1/0,wo=null,Ma=null,Po=!1,ja=null,Rr=0,Ic=0,Fc=null,br=0,Hc=null;return dt.attemptContinuousHydration=function(e){if(e.tag===13){var n=De(e,67108864);n!==null&&Pn(n,e,67108864),sc(e,67108864)}},dt.attemptHydrationAtCurrentPriority=function(e){if(e.tag===13){var n=Zn(),s=De(e,n);s!==null&&Pn(s,e,n),sc(e,n)}},dt.attemptSynchronousHydration=function(e){switch(e.tag){case 3:if(e=e.stateNode,e.current.memoizedState.isDehydrated){var n=b(e.pendingLanes);if(n!==0){for(e.pendingLanes|=2,e.entangledLanes|=2;n;){var s=1<<31-Jn(n);e.entanglements[1]|=s,n&=~s}ke(e),(Nt&6)===0&&(Ar=bi()+500,Ft(0))}}break;case 13:n=De(e,2),n!==null&&Pn(n,e,2),cd(),sc(e,2)}},dt.batchedUpdates=function(e,n){return e(n)},dt.createComponentSelector=function(e){return{$$typeof:Ro,value:e}},dt.createContainer=function(e,n,s,l,f,h,C,z,Y,re){return yd(e,n,!1,null,s,l,h,C,z,Y,re,null)},dt.createHasPseudoClassSelector=function(e){return{$$typeof:bo,value:e}},dt.createHydrationContainer=function(e,n,s,l,f,h,C,z,Y,re,_e,Re,be){return e=yd(s,l,!0,e,f,h,z,Y,re,_e,Re,be),e.context=xd(null),s=e.current,l=Zn(),f=pe(l),f.callback=n??null,Me(s,f,l),e.current.lanes=l,L(e,l),ke(e),e},dt.createPortal=function(e,n,s){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:fs,key:l==null?null:""+l,children:e,containerInfo:n,implementation:s}},dt.createRoleSelector=function(e){return{$$typeof:Uo,value:e}},dt.createTestNameSelector=function(e){return{$$typeof:Co,value:e}},dt.createTextSelector=function(e){return{$$typeof:Do,value:e}},dt.defaultOnCaughtError=function(e){console.error(e)},dt.defaultOnRecoverableError=function(e){rp(e)},dt.defaultOnUncaughtError=function(e){rp(e)},dt.deferredUpdates=function(e){var n=tt.T,s=Ga();try{return Hn(32),tt.T=null,e()}finally{Hn(s),tt.T=n}},dt.discreteUpdates=function(e,n,s,l,f){var h=tt.T,C=Ga();try{return Hn(2),tt.T=null,e(n,s,l,f)}finally{Hn(C),tt.T=h,Nt===0&&(Ar=bi()+500)}},dt.findAllNodes=Zl,dt.findBoundingRects=function(e,n){if(!mr)throw Error(o(363));n=Zl(e,n),e=[];for(var s=0;s<n.length;s++)e.push(xv(n[s]));for(n=e.length-1;0<n;n--){s=e[n];for(var l=s.x,f=l+s.width,h=s.y,C=h+s.height,z=n-1;0<=z;z--)if(n!==z){var Y=e[z],re=Y.x,_e=re+Y.width,Re=Y.y,be=Re+Y.height;if(l>=re&&h>=Re&&f<=_e&&C<=be){e.splice(n,1);break}else if(l!==re||s.width!==Y.width||be<h||Re>C){if(!(h!==Re||s.height!==Y.height||_e<l||re>f)){re>l&&(Y.width+=re-l,Y.x=l),_e<f&&(Y.width=f-re),e.splice(n,1);break}}else{Re>h&&(Y.height+=Re-h,Y.y=h),be<C&&(Y.height=C-Re),e.splice(n,1);break}}}return e},dt.findHostInstance=Ad,dt.findHostInstanceWithNoPortals=function(e){return e=S(e),e=e!==null?w(e):null,e===null?null:hr(e.stateNode)},dt.findHostInstanceWithWarning=function(e){return Ad(e)},dt.flushPassiveEffects=Ha,dt.flushSyncFromReconciler=function(e){var n=Nt;Nt|=1;var s=tt.T,l=Ga();try{if(Hn(2),tt.T=null,e)return e()}finally{Hn(l),tt.T=s,Nt=n,(Nt&6)===0&&Ft(0)}},dt.flushSyncWork=cd,dt.focusWithin=function(e,n){if(!mr)throw Error(o(363));for(e=Yl(e),n=sd(e,n),n=Array.from(n),e=0;e<n.length;){var s=n[e++],l=s.tag;if(!vr(s)){if((l===5||l===26||l===27)&&bv(s.stateNode))return!0;for(s=s.child;s!==null;)n.push(s),s=s.sibling}}return!1},dt.getFindAllNodesFailureDescription=function(e,n){if(!mr)throw Error(o(363));var s=0,l=[];e=[Yl(e),0];for(var f=0;f<e.length;){var h=e[f++],C=h.tag,z=e[f++],Y=n[z];if((C!==5&&C!==26&&C!==27||!vr(h))&&(Kl(h,Y)&&(l.push(Ql(Y)),z++,z>s&&(s=z)),z<n.length))for(h=h.child;h!==null;)e.push(h,z),h=h.sibling}if(s<n.length){for(e=[];s<n.length;s++)e.push(Ql(n[s]));return`findAllNodes was able to match part of the selector:
  `+(l.join(" > ")+`

No matching component was found for:
  `)+e.join(" > ")}return null},dt.getPublicRootInstance=function(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 27:case 5:return hr(e.child.stateNode);default:return e.child.stateNode}},dt.injectIntoDevTools=function(){var e={bundleType:0,version:av,rendererPackageName:sv,currentDispatcherRef:tt,findFiberByHostInstance:Od,reconcilerVersion:"19.0.0"};if(Nd!==null&&(e.rendererConfig=Nd),typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u")e=!1;else{var n=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(n.isDisabled||!n.supportsFiber)e=!0;else{try{gr=n.inject(e),$n=n}catch{}e=!!n.checkDCE}}return e},dt.isAlreadyRendering=function(){return!1},dt.observeVisibleRects=function(e,n,s,l){if(!mr)throw Error(o(363));e=Zl(e,n);var f=Uv(e,s,l).disconnect;return{disconnect:function(){f()}}},dt.shouldError=function(){return null},dt.shouldSuspend=function(){return!1},dt.startHostTransition=function(e,n,s,l){if(e.tag!==5)throw Error(o(476));var f=pf(e).queue;df(e,f,n,ps,s===null?r:function(){var h=pf(e).next.queue;return rr(e,h,{},Zn()),s(l)})},dt.updateContainer=function(e,n,s,l){var f=n.current,h=Zn();return Rd(f,h,e,n,s,l),h},dt.updateContainerSync=function(e,n,s,l){return n.tag===0&&Ha(),Rd(n.current,2,e,n,s,l),2},dt},t.exports.default=t.exports,Object.defineProperty(t.exports,"__esModule",{value:!0})})(tu)),tu.exports}var Mh;function ay(){return Mh||(Mh=1,eu.exports=iy()),eu.exports}ay();_m();const Sm=((t,i)=>typeof window<"u"&&(((t=window.document)==null?void 0:t.createElement)||((i=window.navigator)==null?void 0:i.product)==="ReactNative"))()?St.useLayoutEffect:St.useEffect;function sy(t){const i=St.useRef(t);return Sm(()=>void(i.current=t),[t]),i}const ry=St.createContext(null);function Em(){const t=St.useContext(ry);if(!t)throw new Error("R3F: Hooks can only be used within the Canvas component!");return t}function Qu(t=a=>a,i){return Em()(t,i)}function oy(t,i=0){const a=Em(),r=a.getState().internal.subscribe,o=sy(t);return Sm(()=>r(o,i,a),[i,r,a]),null}const yh={};let ly=0;const cy=t=>typeof t=="function";function uy(t){if(cy(t)){const i=`${ly++}`;return yh[i]=t,i}else Object.assign(yh,t)}/**
 * postprocessing v6.38.0 build Sat Nov 08 2025
 * https://github.com/pmndrs/postprocessing
 * Copyright 2015-2025 Raoul van Rüschen
 * @license Zlib
 */var au=1/1e3,fy=1e3,dy=class{constructor(){this.startTime=performance.now(),this.previousTime=0,this.currentTime=0,this._delta=0,this._elapsed=0,this._fixedDelta=1e3/60,this.timescale=1,this.useFixedDelta=!1,this._autoReset=!1}get autoReset(){return this._autoReset}set autoReset(t){typeof document<"u"&&document.hidden!==void 0&&(t?document.addEventListener("visibilitychange",this):document.removeEventListener("visibilitychange",this),this._autoReset=t)}get delta(){return this._delta*au}get fixedDelta(){return this._fixedDelta*au}set fixedDelta(t){this._fixedDelta=t*fy}get elapsed(){return this._elapsed*au}update(t){this.useFixedDelta?this._delta=this.fixedDelta:(this.previousTime=this.currentTime,this.currentTime=(t!==void 0?t:performance.now())-this.startTime,this._delta=this.currentTime-this.previousTime),this._delta*=this.timescale,this._elapsed+=this._delta}reset(){this._delta=0,this._elapsed=0,this.currentTime=performance.now()-this.startTime}getDelta(){return this.delta}getElapsed(){return this.elapsed}handleEvent(t){document.hidden||(this.currentTime=performance.now()-this.startTime)}dispose(){this.autoReset=!1}},py=(()=>{const t=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),i=new Float32Array([0,0,2,0,0,2]),a=new as;return a.setAttribute("position",new ii(t,3)),a.setAttribute("uv",new ii(i,2)),a})(),Wn=class Cu{static get fullscreenGeometry(){return py}constructor(i="Pass",a=new fl,r=new ku){this.name=i,this.renderer=null,this.scene=a,this.camera=r,this.screen=null,this.rtt=!0,this.needsSwap=!0,this.needsDepthTexture=!1,this.enabled=!0}get renderToScreen(){return!this.rtt}set renderToScreen(i){if(this.rtt===i){const a=this.fullscreenMaterial;a!==null&&(a.needsUpdate=!0),this.rtt=!i}}set mainScene(i){}set mainCamera(i){}setRenderer(i){this.renderer=i}isEnabled(){return this.enabled}setEnabled(i){this.enabled=i}get fullscreenMaterial(){return this.screen!==null?this.screen.material:null}set fullscreenMaterial(i){let a=this.screen;a!==null?a.material=i:(a=new gi(Cu.fullscreenGeometry,i),a.frustumCulled=!1,this.scene===null&&(this.scene=new fl),this.scene.add(a),this.screen=a)}getFullscreenMaterial(){return this.fullscreenMaterial}setFullscreenMaterial(i){this.fullscreenMaterial=i}getDepthTexture(){return null}setDepthTexture(i,a=Js){}render(i,a,r,o,c){throw new Error("Render method not implemented!")}setSize(i,a){}initialize(i,a,r){}dispose(){for(const i of Object.keys(this)){const a=this[i];(a instanceof $t||a instanceof dm||a instanceof Yu||a instanceof Cu)&&this[i].dispose()}this.fullscreenMaterial!==null&&this.fullscreenMaterial.dispose()}},hy=class extends Wn{constructor(){super("ClearMaskPass",null,null),this.needsSwap=!1}render(t,i,a,r,o){const c=t.state.buffers.stencil;c.setLocked(!1),c.setTest(!1)}},my=`#ifdef COLOR_WRITE
#include <common>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#endif
#ifdef DEPTH_WRITE
#include <packing>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}
#endif
#ifdef USE_WEIGHTS
uniform vec4 channelWeights;
#endif
uniform float opacity;varying vec2 vUv;void main(){
#ifdef COLOR_WRITE
vec4 texel=texture2D(inputBuffer,vUv);
#ifdef USE_WEIGHTS
texel*=channelWeights;
#endif
gl_FragColor=opacity*texel;
#ifdef COLOR_SPACE_CONVERSION
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
#else
gl_FragColor=vec4(0.0);
#endif
#ifdef DEPTH_WRITE
gl_FragDepth=readDepth(vUv);
#endif
}`,Tm="varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}",Mm=class extends rn{constructor(){super({name:"CopyMaterial",defines:{DEPTH_PACKING:"0",COLOR_WRITE:"1"},uniforms:{inputBuffer:new it(null),depthBuffer:new it(null),channelWeights:new it(null),opacity:new it(1)},blending:Xn,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:my,vertexShader:Tm}),this.depthFunc=cl}get inputBuffer(){return this.uniforms.inputBuffer.value}set inputBuffer(t){const i=t!==null;this.colorWrite!==i&&(i?this.defines.COLOR_WRITE=!0:delete this.defines.COLOR_WRITE,this.colorWrite=i,this.needsUpdate=!0),this.uniforms.inputBuffer.value=t}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(t){const i=t!==null;this.depthWrite!==i&&(i?this.defines.DEPTH_WRITE=!0:delete this.defines.DEPTH_WRITE,this.depthTest=i,this.depthWrite=i,this.needsUpdate=!0),this.uniforms.depthBuffer.value=t}set depthPacking(t){this.defines.DEPTH_PACKING=t.toFixed(0),this.needsUpdate=!0}get channelWeights(){return this.uniforms.channelWeights.value}set channelWeights(t){t!==null?(this.defines.USE_WEIGHTS="1",this.uniforms.channelWeights.value=t):delete this.defines.USE_WEIGHTS,this.needsUpdate=!0}setInputBuffer(t){this.uniforms.inputBuffer.value=t}getOpacity(t){return this.uniforms.opacity.value}setOpacity(t){this.uniforms.opacity.value=t}},vy=class extends Wn{constructor(t,i=!0){super("CopyPass"),this.fullscreenMaterial=new Mm,this.needsSwap=!1,this.renderTarget=t,t===void 0&&(this.renderTarget=new $t(1,1,{minFilter:Hi,magFilter:Hi,stencilBuffer:!1,depthBuffer:!1}),this.renderTarget.texture.name="CopyPass.Target"),this.autoResize=i}get resize(){return this.autoResize}set resize(t){this.autoResize=t}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}setAutoResizeEnabled(t){this.autoResize=t}render(t,i,a,r,o){this.fullscreenMaterial.inputBuffer=i.texture,t.setRenderTarget(this.renderToScreen?null:this.renderTarget),t.render(this.scene,this.camera)}setSize(t,i){this.autoResize&&this.renderTarget.setSize(t,i)}initialize(t,i,a){a!==void 0&&(this.renderTarget.texture.type=a,a!==Cn?this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1":t!==null&&t.outputColorSpace===vn&&(this.renderTarget.texture.colorSpace=vn))}},xh=new at,ym=class extends Wn{constructor(t=!0,i=!0,a=!1){super("ClearPass",null,null),this.needsSwap=!1,this.color=t,this.depth=i,this.stencil=a,this.overrideClearColor=null,this.overrideClearAlpha=-1}setClearFlags(t,i,a){this.color=t,this.depth=i,this.stencil=a}getOverrideClearColor(){return this.overrideClearColor}setOverrideClearColor(t){this.overrideClearColor=t}getOverrideClearAlpha(){return this.overrideClearAlpha}setOverrideClearAlpha(t){this.overrideClearAlpha=t}render(t,i,a,r,o){const c=this.overrideClearColor,u=this.overrideClearAlpha,d=t.getClearAlpha(),p=c!==null,g=u>=0;p?(t.getClearColor(xh),t.setClearColor(c,g?u:d)):g&&t.setClearAlpha(u),t.setRenderTarget(this.renderToScreen?null:i),t.clear(this.color,this.depth,this.stencil),p?t.setClearColor(xh,d):g&&t.setClearAlpha(d)}},gy=class extends Wn{constructor(t,i){super("MaskPass",t,i),this.needsSwap=!1,this.clearPass=new ym(!1,!1,!0),this.inverse=!1}set mainScene(t){this.scene=t}set mainCamera(t){this.camera=t}get inverted(){return this.inverse}set inverted(t){this.inverse=t}get clear(){return this.clearPass.enabled}set clear(t){this.clearPass.enabled=t}getClearPass(){return this.clearPass}isInverted(){return this.inverted}setInverted(t){this.inverted=t}render(t,i,a,r,o){const c=t.getContext(),u=t.state.buffers,d=this.scene,p=this.camera,g=this.clearPass,E=this.inverted?0:1,_=1-E;u.color.setMask(!1),u.depth.setMask(!1),u.color.setLocked(!0),u.depth.setLocked(!0),u.stencil.setTest(!0),u.stencil.setOp(c.REPLACE,c.REPLACE,c.REPLACE),u.stencil.setFunc(c.ALWAYS,E,4294967295),u.stencil.setClear(_),u.stencil.setLocked(!0),this.clearPass.enabled&&(this.renderToScreen?g.render(t,null):(g.render(t,i),g.render(t,a))),this.renderToScreen?(t.setRenderTarget(null),t.render(d,p)):(t.setRenderTarget(i),t.render(d,p),t.setRenderTarget(a),t.render(d,p)),u.color.setLocked(!1),u.depth.setLocked(!1),u.stencil.setLocked(!1),u.stencil.setFunc(c.EQUAL,1,4294967295),u.stencil.setOp(c.KEEP,c.KEEP,c.KEEP),u.stencil.setLocked(!0)}},_y=class{constructor(t=null,{depthBuffer:i=!0,stencilBuffer:a=!1,multisampling:r=0,frameBufferType:o}={}){this.renderer=null,this.inputBuffer=this.createBuffer(i,a,o,r),this.outputBuffer=this.inputBuffer.clone(),this.copyPass=new vy,this.depthTexture=null,this.passes=[],this.timer=new dy,this.autoRenderToScreen=!0,this.setRenderer(t)}get multisampling(){return this.inputBuffer.samples||0}set multisampling(t){const i=this.inputBuffer,a=this.multisampling;a>0&&t>0?(this.inputBuffer.samples=t,this.outputBuffer.samples=t,this.inputBuffer.dispose(),this.outputBuffer.dispose()):a!==t&&(this.inputBuffer.dispose(),this.outputBuffer.dispose(),this.inputBuffer=this.createBuffer(i.depthBuffer,i.stencilBuffer,i.texture.type,t),this.inputBuffer.depthTexture=this.depthTexture,this.outputBuffer=this.inputBuffer.clone())}getTimer(){return this.timer}getRenderer(){return this.renderer}setRenderer(t){if(this.renderer=t,t!==null){const i=t.getSize(new Ye),a=t.getContext().getContextAttributes().alpha,r=this.inputBuffer.texture.type;r===Cn&&t.outputColorSpace===vn&&(this.inputBuffer.texture.colorSpace=vn,this.outputBuffer.texture.colorSpace=vn,this.inputBuffer.dispose(),this.outputBuffer.dispose()),t.autoClear=!1,this.setSize(i.width,i.height);for(const o of this.passes)o.initialize(t,a,r)}}replaceRenderer(t,i=!0){const a=this.renderer,r=a.domElement.parentNode;return this.setRenderer(t),i&&r!==null&&(r.removeChild(a.domElement),r.appendChild(t.domElement)),a}createDepthTexture(){const t=this.depthTexture=new Xu;return this.inputBuffer.depthTexture=t,this.inputBuffer.dispose(),this.inputBuffer.stencilBuffer?(t.format=kr,t.type=Ys):t.type=Ks,t}deleteDepthTexture(){if(this.depthTexture!==null){this.depthTexture.dispose(),this.depthTexture=null,this.inputBuffer.depthTexture=null,this.inputBuffer.dispose();for(const t of this.passes)t.setDepthTexture(null)}}createBuffer(t,i,a,r){const o=this.renderer,c=o===null?new Ye:o.getDrawingBufferSize(new Ye),u={minFilter:Hi,magFilter:Hi,stencilBuffer:i,depthBuffer:t,type:a},d=new $t(c.width,c.height,u);return r>0&&(d.samples=r),a===Cn&&o!==null&&o.outputColorSpace===vn&&(d.texture.colorSpace=vn),d.texture.name="EffectComposer.Buffer",d.texture.generateMipmaps=!1,d}setMainScene(t){for(const i of this.passes)i.mainScene=t}setMainCamera(t){for(const i of this.passes)i.mainCamera=t}addPass(t,i){const a=this.passes,r=this.renderer,o=r.getDrawingBufferSize(new Ye),c=r.getContext().getContextAttributes().alpha,u=this.inputBuffer.texture.type;if(t.setRenderer(r),t.setSize(o.width,o.height),t.initialize(r,c,u),this.autoRenderToScreen&&(a.length>0&&(a[a.length-1].renderToScreen=!1),t.renderToScreen&&(this.autoRenderToScreen=!1)),i!==void 0?a.splice(i,0,t):a.push(t),this.autoRenderToScreen&&(a[a.length-1].renderToScreen=!0),t.needsDepthTexture||this.depthTexture!==null)if(this.depthTexture===null){const d=this.createDepthTexture();for(t of a)t.setDepthTexture(d)}else t.setDepthTexture(this.depthTexture)}removePass(t){const i=this.passes,a=i.indexOf(t);if(a!==-1&&i.splice(a,1).length>0){if(this.depthTexture!==null){const c=(d,p)=>d||p.needsDepthTexture;i.reduce(c,!1)||(t.getDepthTexture()===this.depthTexture&&t.setDepthTexture(null),this.deleteDepthTexture())}this.autoRenderToScreen&&a===i.length&&(t.renderToScreen=!1,i.length>0&&(i[i.length-1].renderToScreen=!0))}}removeAllPasses(){const t=this.passes;this.deleteDepthTexture(),t.length>0&&(this.autoRenderToScreen&&(t[t.length-1].renderToScreen=!1),this.passes=[])}render(t){const i=this.renderer,a=this.copyPass;let r=this.inputBuffer,o=this.outputBuffer,c=!1,u,d,p;t===void 0&&(this.timer.update(),t=this.timer.getDelta());for(const g of this.passes)g.enabled&&(g.render(i,r,o,t,c),g.needsSwap&&(c&&(a.renderToScreen=g.renderToScreen,u=i.getContext(),d=i.state.buffers.stencil,d.setFunc(u.NOTEQUAL,1,4294967295),a.render(i,r,o,t,c),d.setFunc(u.EQUAL,1,4294967295)),p=r,r=o,o=p),g instanceof gy?c=!0:g instanceof hy&&(c=!1))}setSize(t,i,a){const r=this.renderer,o=r.getSize(new Ye);(t===void 0||i===void 0)&&(t=o.width,i=o.height),(o.width!==t||o.height!==i)&&r.setSize(t,i,a);const c=r.getDrawingBufferSize(new Ye);this.inputBuffer.setSize(c.width,c.height),this.outputBuffer.setSize(c.width,c.height);for(const u of this.passes)u.setSize(c.width,c.height)}reset(){this.dispose(),this.autoRenderToScreen=!0}dispose(){for(const t of this.passes)t.dispose();this.passes=[],this.inputBuffer!==null&&this.inputBuffer.dispose(),this.outputBuffer!==null&&this.outputBuffer.dispose(),this.deleteDepthTexture(),this.copyPass.dispose(),this.timer.dispose(),Wn.fullscreenGeometry.dispose()}},wa={NONE:0,DEPTH:1,CONVOLUTION:2},At={FRAGMENT_HEAD:"FRAGMENT_HEAD",FRAGMENT_MAIN_UV:"FRAGMENT_MAIN_UV",FRAGMENT_MAIN_IMAGE:"FRAGMENT_MAIN_IMAGE",VERTEX_HEAD:"VERTEX_HEAD",VERTEX_MAIN_SUPPORT:"VERTEX_MAIN_SUPPORT"},Sy=class{constructor(){this.shaderParts=new Map([[At.FRAGMENT_HEAD,null],[At.FRAGMENT_MAIN_UV,null],[At.FRAGMENT_MAIN_IMAGE,null],[At.VERTEX_HEAD,null],[At.VERTEX_MAIN_SUPPORT,null]]),this.defines=new Map,this.uniforms=new Map,this.blendModes=new Map,this.extensions=new Set,this.attributes=wa.NONE,this.varyings=new Set,this.uvTransformation=!1,this.readDepth=!1,this.colorSpace=js}},su=!1,Ah=class{constructor(t=null){this.originalMaterials=new Map,this.material=null,this.materials=null,this.materialsBackSide=null,this.materialsDoubleSide=null,this.materialsFlatShaded=null,this.materialsFlatShadedBackSide=null,this.materialsFlatShadedDoubleSide=null,this.setMaterial(t),this.meshCount=0,this.replaceMaterial=i=>{if(i.isMesh){let a;if(i.material.flatShading)switch(i.material.side){case Rn:a=this.materialsFlatShadedDoubleSide;break;case gn:a=this.materialsFlatShadedBackSide;break;default:a=this.materialsFlatShaded;break}else switch(i.material.side){case Rn:a=this.materialsDoubleSide;break;case gn:a=this.materialsBackSide;break;default:a=this.materials;break}this.originalMaterials.set(i,i.material),i.isSkinnedMesh?i.material=a[2]:i.isInstancedMesh?i.material=a[1]:i.material=a[0],++this.meshCount}}}cloneMaterial(t){if(!(t instanceof rn))return t.clone();const i=t.uniforms,a=new Map;for(const o in i){const c=i[o].value;c.isRenderTargetTexture&&(i[o].value=null,a.set(o,c))}const r=t.clone();for(const o of a)i[o[0]].value=o[1],r.uniforms[o[0]].value=o[1];return r}setMaterial(t){if(this.disposeMaterials(),this.material=t,t!==null){const i=this.materials=[this.cloneMaterial(t),this.cloneMaterial(t),this.cloneMaterial(t)];for(const a of i)a.uniforms=Object.assign({},t.uniforms),a.side=Pa;i[2].skinning=!0,this.materialsBackSide=i.map(a=>{const r=this.cloneMaterial(a);return r.uniforms=Object.assign({},t.uniforms),r.side=gn,r}),this.materialsDoubleSide=i.map(a=>{const r=this.cloneMaterial(a);return r.uniforms=Object.assign({},t.uniforms),r.side=Rn,r}),this.materialsFlatShaded=i.map(a=>{const r=this.cloneMaterial(a);return r.uniforms=Object.assign({},t.uniforms),r.flatShading=!0,r}),this.materialsFlatShadedBackSide=i.map(a=>{const r=this.cloneMaterial(a);return r.uniforms=Object.assign({},t.uniforms),r.flatShading=!0,r.side=gn,r}),this.materialsFlatShadedDoubleSide=i.map(a=>{const r=this.cloneMaterial(a);return r.uniforms=Object.assign({},t.uniforms),r.flatShading=!0,r.side=Rn,r})}}render(t,i,a){const r=t.shadowMap.enabled;if(t.shadowMap.enabled=!1,su){const o=this.originalMaterials;this.meshCount=0,i.traverse(this.replaceMaterial),t.render(i,a);for(const c of o)c[0].material=c[1];this.meshCount!==o.size&&o.clear()}else{const o=i.overrideMaterial;i.overrideMaterial=this.material,t.render(i,a),i.overrideMaterial=o}t.shadowMap.enabled=r}disposeMaterials(){if(this.material!==null){const t=this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);for(const i of t)i.dispose()}}dispose(){this.originalMaterials.clear(),this.disposeMaterials()}static get workaroundEnabled(){return su}static set workaroundEnabled(t){su=t}},xa=-1,Un=class extends pl{constructor(t,i=xa,a=xa,r=1){super(),this.resizable=t,this.baseSize=new Ye(1,1),this.preferredSize=new Ye(i,a),this.target=this.preferredSize,this.s=r,this.effectiveSize=new Ye,this.addEventListener("change",()=>this.updateEffectiveSize()),this.updateEffectiveSize()}updateEffectiveSize(){const t=this.baseSize,i=this.preferredSize,a=this.effectiveSize,r=this.scale;i.width!==xa?a.width=i.width:i.height!==xa?a.width=Math.round(i.height*(t.width/Math.max(t.height,1))):a.width=Math.round(t.width*r),i.height!==xa?a.height=i.height:i.width!==xa?a.height=Math.round(i.width/Math.max(t.width/Math.max(t.height,1),1)):a.height=Math.round(t.height*r)}get width(){return this.effectiveSize.width}set width(t){this.preferredWidth=t}get height(){return this.effectiveSize.height}set height(t){this.preferredHeight=t}getWidth(){return this.width}getHeight(){return this.height}get scale(){return this.s}set scale(t){this.s!==t&&(this.s=t,this.preferredSize.setScalar(xa),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getScale(){return this.scale}setScale(t){this.scale=t}get baseWidth(){return this.baseSize.width}set baseWidth(t){this.baseSize.width!==t&&(this.baseSize.width=t,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getBaseWidth(){return this.baseWidth}setBaseWidth(t){this.baseWidth=t}get baseHeight(){return this.baseSize.height}set baseHeight(t){this.baseSize.height!==t&&(this.baseSize.height=t,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getBaseHeight(){return this.baseHeight}setBaseHeight(t){this.baseHeight=t}setBaseSize(t,i){(this.baseSize.width!==t||this.baseSize.height!==i)&&(this.baseSize.set(t,i),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}get preferredWidth(){return this.preferredSize.width}set preferredWidth(t){this.preferredSize.width!==t&&(this.preferredSize.width=t,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getPreferredWidth(){return this.preferredWidth}setPreferredWidth(t){this.preferredWidth=t}get preferredHeight(){return this.preferredSize.height}set preferredHeight(t){this.preferredSize.height!==t&&(this.preferredSize.height=t,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getPreferredHeight(){return this.preferredHeight}setPreferredHeight(t){this.preferredHeight=t}setPreferredSize(t,i){(this.preferredSize.width!==t||this.preferredSize.height!==i)&&(this.preferredSize.set(t,i),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}copy(t){this.s=t.scale,this.baseSize.set(t.baseWidth,t.baseHeight),this.preferredSize.set(t.preferredWidth,t.preferredHeight),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height)}static get AUTO_SIZE(){return xa}},ht={ADD:0,AVERAGE:2,COLOR:3,COLOR_BURN:4,COLOR_DODGE:5,DARKEN:6,DIFFERENCE:7,DIVIDE:8,DST:9,EXCLUSION:10,HARD_LIGHT:11,HARD_MIX:12,HUE:13,INVERT:14,INVERT_RGB:15,LIGHTEN:16,LINEAR_BURN:17,LINEAR_DODGE:18,LINEAR_LIGHT:19,LUMINOSITY:20,MULTIPLY:21,NEGATION:22,NORMAL:23,OVERLAY:24,PIN_LIGHT:25,REFLECT:26,SATURATION:27,SCREEN:28,SOFT_LIGHT:29,SRC:30,SUBTRACT:31,VIVID_LIGHT:32},Ey="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(x.rgb+y.rgb,y.a),y.a*opacity);}",Ty="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4((x.rgb+y.rgb)*0.5,y.a),y.a*opacity);}",My="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(yHSL.xy,xHSL.z));return mix(x,vec4(z,y.a),y.a*opacity);}",yy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 a=x.rgb,b=y.rgb;vec3 z=mix(step(0.0,b)*(1.0-min(vec3(1.0),(1.0-a)/b)),vec3(1.0),step(1.0,a));return mix(x,vec4(z,y.a),y.a*opacity);}",xy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 a=x.rgb,b=y.rgb;vec3 z=step(0.0,a)*mix(min(vec3(1.0),a/max(1.0-b,1e-9)),vec3(1.0),step(1.0,b));return mix(x,vec4(z,y.a),y.a*opacity);}",Ay="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(min(x.rgb,y.rgb),y.a),y.a*opacity);}",Ry="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(abs(x.rgb-y.rgb),y.a),y.a*opacity);}",by="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(x.rgb/max(y.rgb,1e-12),y.a),y.a*opacity);}",Uy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4((x.rgb+y.rgb-2.0*x.rgb*y.rgb),y.a),y.a*opacity);}",Cy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 a=min(x.rgb,1.0);vec3 b=min(y.rgb,1.0);vec3 z=mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(0.5,b));return mix(x,vec4(z,y.a),y.a*opacity);}",Dy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(step(1.0,x.rgb+y.rgb),y.a),y.a*opacity);}",wy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(yHSL.x,xHSL.yz));return mix(x,vec4(z,y.a),y.a*opacity);}",Py="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(1.0-y.rgb,y.a),y.a*opacity);}",Ny="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(y.rgb*(1.0-x.rgb),y.a),y.a*opacity);}",Ly="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(max(x.rgb,y.rgb),y.a),y.a*opacity);}",By="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(clamp(y.rgb+x.rgb-1.0,0.0,1.0),y.a),y.a*opacity);}",Oy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(min(x.rgb+y.rgb,1.0),y.a),y.a*opacity);}",Iy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(clamp(2.0*y.rgb+x.rgb-1.0,0.0,1.0),y.a),y.a*opacity);}",Fy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(xHSL.xy,yHSL.z));return mix(x,vec4(z,y.a),y.a*opacity);}",Hy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(x.rgb*y.rgb,y.a),y.a*opacity);}",zy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(1.0-abs(1.0-x.rgb-y.rgb),y.a),y.a*opacity);}",Gy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y,y.a*opacity);}",Vy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 z=mix(2.0*y.rgb*x.rgb,1.0-2.0*(1.0-y.rgb)*(1.0-x.rgb),step(0.5,x.rgb));return mix(x,vec4(z,y.a),y.a*opacity);}",Xy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 y2=2.0*y.rgb;vec3 z=mix(mix(y2,x.rgb,step(0.5*x.rgb,y.rgb)),max(y2-1.0,vec3(0.0)),step(x.rgb,y2-1.0));return mix(x,vec4(z,y.a),y.a*opacity);}",Wy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 z=mix(min(x.rgb*x.rgb/max(1.0-y.rgb,1e-12),1.0),y.rgb,step(1.0,y.rgb));return mix(x,vec4(z,y.a),y.a*opacity);}",qy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(xHSL.x,yHSL.y,xHSL.z));return mix(x,vec4(z,y.a),y.a*opacity);}",ky="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(x.rgb+y.rgb-min(x.rgb*y.rgb,1.0),y.a),y.a*opacity);}",Yy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 a=x.rgb;vec3 b=y.rgb;vec3 y2=2.0*b;vec3 w=step(0.5,b);vec3 c=a-(1.0-y2)*a*(1.0-a);vec3 d=mix(a+(y2-1.0)*(sqrt(a)-a),a+(y2-1.0)*a*((16.0*a-12.0)*a+3.0),w*(1.0-step(0.25,a)));vec3 z=mix(c,d,w);return mix(x,vec4(z,y.a),y.a*opacity);}",Ky="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return y;}",Qy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,vec4(max(x.rgb+y.rgb-1.0,0.0),y.a),y.a*opacity);}",Zy="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 z=mix(max(1.0-min((1.0-x.rgb)/(2.0*y.rgb),1.0),0.0),min(x.rgb/(2.0*(1.0-y.rgb)),1.0),step(0.5,y.rgb));return mix(x,vec4(z,y.a),y.a*opacity);}",jy=new Map([[ht.ADD,Ey],[ht.AVERAGE,Ty],[ht.COLOR,My],[ht.COLOR_BURN,yy],[ht.COLOR_DODGE,xy],[ht.DARKEN,Ay],[ht.DIFFERENCE,Ry],[ht.DIVIDE,by],[ht.DST,null],[ht.EXCLUSION,Uy],[ht.HARD_LIGHT,Cy],[ht.HARD_MIX,Dy],[ht.HUE,wy],[ht.INVERT,Py],[ht.INVERT_RGB,Ny],[ht.LIGHTEN,Ly],[ht.LINEAR_BURN,By],[ht.LINEAR_DODGE,Oy],[ht.LINEAR_LIGHT,Iy],[ht.LUMINOSITY,Fy],[ht.MULTIPLY,Hy],[ht.NEGATION,zy],[ht.NORMAL,Gy],[ht.OVERLAY,Vy],[ht.PIN_LIGHT,Xy],[ht.REFLECT,Wy],[ht.SATURATION,qy],[ht.SCREEN,ky],[ht.SOFT_LIGHT,Yy],[ht.SRC,Ky],[ht.SUBTRACT,Qy],[ht.VIVID_LIGHT,Zy]]),Jy=class extends pl{constructor(t,i=1){super(),this._blendFunction=t,this.opacity=new it(i)}getOpacity(){return this.opacity.value}setOpacity(t){this.opacity.value=t}get blendFunction(){return this._blendFunction}set blendFunction(t){this._blendFunction=t,this.dispatchEvent({type:"change"})}getBlendFunction(){return this.blendFunction}setBlendFunction(t){this.blendFunction=t}getShaderCode(){return jy.get(this.blendFunction)}},Zs=class extends pl{constructor(t,i,{attributes:a=wa.NONE,blendFunction:r=ht.NORMAL,defines:o=new Map,uniforms:c=new Map,extensions:u=null,vertexShader:d=null}={}){super(),this.name=t,this.renderer=null,this.attributes=a,this.fragmentShader=i,this.vertexShader=d,this.defines=o,this.uniforms=c,this.extensions=u,this.blendMode=new Jy(r),this.blendMode.addEventListener("change",p=>this.setChanged()),this._inputColorSpace=js,this._outputColorSpace=ba}get inputColorSpace(){return this._inputColorSpace}set inputColorSpace(t){this._inputColorSpace=t,this.setChanged()}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t,this.setChanged()}set mainScene(t){}set mainCamera(t){}getName(){return this.name}setRenderer(t){this.renderer=t}getDefines(){return this.defines}getUniforms(){return this.uniforms}getExtensions(){return this.extensions}getBlendMode(){return this.blendMode}getAttributes(){return this.attributes}setAttributes(t){this.attributes=t,this.setChanged()}getFragmentShader(){return this.fragmentShader}setFragmentShader(t){this.fragmentShader=t,this.setChanged()}getVertexShader(){return this.vertexShader}setVertexShader(t){this.vertexShader=t,this.setChanged()}setChanged(){this.dispatchEvent({type:"change"})}setDepthTexture(t,i=Js){}update(t,i,a){}setSize(t,i){}initialize(t,i,a){}dispose(){for(const t of Object.keys(this)){const i=this[t];(i instanceof $t||i instanceof dm||i instanceof Yu||i instanceof Wn)&&this[t].dispose()}}},Zu={MEDIUM:2,LARGE:3},$y=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec4 sum=texture2D(inputBuffer,vUv0);sum+=texture2D(inputBuffer,vUv1);sum+=texture2D(inputBuffer,vUv2);sum+=texture2D(inputBuffer,vUv3);gl_FragColor=sum*0.25;
#include <colorspace_fragment>
}`,ex="uniform vec4 texelSize;uniform float kernel;uniform float scale;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vec2 dUv=(texelSize.xy*vec2(kernel)+texelSize.zw)*scale;vUv0=vec2(uv.x-dUv.x,uv.y+dUv.y);vUv1=vec2(uv.x+dUv.x,uv.y+dUv.y);vUv2=vec2(uv.x+dUv.x,uv.y-dUv.y);vUv3=vec2(uv.x-dUv.x,uv.y-dUv.y);gl_Position=vec4(position.xy,1.0,1.0);}",tx=[new Float32Array([0,0]),new Float32Array([0,1,1]),new Float32Array([0,1,1,2]),new Float32Array([0,1,2,2,3]),new Float32Array([0,1,2,3,4,4,5]),new Float32Array([0,1,2,3,4,5,7,8,9,10])],nx=class extends rn{constructor(t=new An){super({name:"KawaseBlurMaterial",uniforms:{inputBuffer:new it(null),texelSize:new it(new An),scale:new it(1),kernel:new it(0)},blending:Xn,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:$y,vertexShader:ex}),this.setTexelSize(t.x,t.y),this.kernelSize=Zu.MEDIUM}set inputBuffer(t){this.uniforms.inputBuffer.value=t}setInputBuffer(t){this.inputBuffer=t}get kernelSequence(){return tx[this.kernelSize]}get scale(){return this.uniforms.scale.value}set scale(t){this.uniforms.scale.value=t}getScale(){return this.uniforms.scale.value}setScale(t){this.uniforms.scale.value=t}getKernel(){return null}get kernel(){return this.uniforms.kernel.value}set kernel(t){this.uniforms.kernel.value=t}setKernel(t){this.kernel=t}setTexelSize(t,i){this.uniforms.texelSize.value.set(t,i,t*.5,i*.5)}setSize(t,i){const a=1/t,r=1/i;this.uniforms.texelSize.value.set(a,r,a*.5,r*.5)}},ix=class extends Wn{constructor({kernelSize:t=Zu.MEDIUM,resolutionScale:i=.5,width:a=Un.AUTO_SIZE,height:r=Un.AUTO_SIZE,resolutionX:o=a,resolutionY:c=r}={}){super("KawaseBlurPass"),this.renderTargetA=new $t(1,1,{depthBuffer:!1}),this.renderTargetA.texture.name="Blur.Target.A",this.renderTargetB=this.renderTargetA.clone(),this.renderTargetB.texture.name="Blur.Target.B";const u=this.resolution=new Un(this,o,c,i);u.addEventListener("change",d=>this.setSize(u.baseWidth,u.baseHeight)),this._blurMaterial=new nx,this._blurMaterial.kernelSize=t,this.copyMaterial=new Mm}getResolution(){return this.resolution}get blurMaterial(){return this._blurMaterial}set blurMaterial(t){this._blurMaterial=t}get dithering(){return this.copyMaterial.dithering}set dithering(t){this.copyMaterial.dithering=t}get kernelSize(){return this.blurMaterial.kernelSize}set kernelSize(t){this.blurMaterial.kernelSize=t}get width(){return this.resolution.width}set width(t){this.resolution.preferredWidth=t}get height(){return this.resolution.height}set height(t){this.resolution.preferredHeight=t}get scale(){return this.blurMaterial.scale}set scale(t){this.blurMaterial.scale=t}getScale(){return this.blurMaterial.scale}setScale(t){this.blurMaterial.scale=t}getKernelSize(){return this.kernelSize}setKernelSize(t){this.kernelSize=t}getResolutionScale(){return this.resolution.scale}setResolutionScale(t){this.resolution.scale=t}render(t,i,a,r,o){const c=this.scene,u=this.camera,d=this.renderTargetA,p=this.renderTargetB,g=this.blurMaterial,E=g.kernelSequence;let _=i;this.fullscreenMaterial=g;for(let v=0,S=E.length;v<S;++v){const U=(v&1)===0?d:p;g.kernel=E[v],g.inputBuffer=_.texture,t.setRenderTarget(U),t.render(c,u),_=U}this.fullscreenMaterial=this.copyMaterial,this.copyMaterial.inputBuffer=_.texture,t.setRenderTarget(this.renderToScreen?null:a),t.render(c,u)}setSize(t,i){const a=this.resolution;a.setBaseSize(t,i);const r=a.width,o=a.height;this.renderTargetA.setSize(r,o),this.renderTargetB.setSize(r,o),this.blurMaterial.setSize(t,i)}initialize(t,i,a){a!==void 0&&(this.renderTargetA.texture.type=a,this.renderTargetB.texture.type=a,a!==Cn?(this.blurMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1",this.copyMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1"):t!==null&&t.outputColorSpace===vn&&(this.renderTargetA.texture.colorSpace=vn,this.renderTargetB.texture.colorSpace=vn))}static get AUTO_SIZE(){return Un.AUTO_SIZE}},ax=`#include <common>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#ifdef RANGE
uniform vec2 range;
#elif defined(THRESHOLD)
uniform float threshold;uniform float smoothing;
#endif
varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);float l=luminance(texel.rgb);float mask=1.0;
#ifdef RANGE
float low=step(range.x,l);float high=step(l,range.y);mask=low*high;
#elif defined(THRESHOLD)
mask=smoothstep(threshold,threshold+smoothing,l);
#endif
#ifdef COLOR
gl_FragColor=texel*mask;
#else
gl_FragColor=vec4(l*mask);
#endif
}`,sx=class extends rn{constructor(t=!1,i=null){super({name:"LuminanceMaterial",defines:{THREE_REVISION:Gu.replace(/\D+/g,"")},uniforms:{inputBuffer:new it(null),threshold:new it(0),smoothing:new it(1),range:new it(null)},blending:Xn,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:ax,vertexShader:Tm}),this.colorOutput=t,this.luminanceRange=i}set inputBuffer(t){this.uniforms.inputBuffer.value=t}setInputBuffer(t){this.uniforms.inputBuffer.value=t}get threshold(){return this.uniforms.threshold.value}set threshold(t){this.smoothing>0||t>0?this.defines.THRESHOLD="1":delete this.defines.THRESHOLD,this.uniforms.threshold.value=t}getThreshold(){return this.threshold}setThreshold(t){this.threshold=t}get smoothing(){return this.uniforms.smoothing.value}set smoothing(t){this.threshold>0||t>0?this.defines.THRESHOLD="1":delete this.defines.THRESHOLD,this.uniforms.smoothing.value=t}getSmoothingFactor(){return this.smoothing}setSmoothingFactor(t){this.smoothing=t}get useThreshold(){return this.threshold>0||this.smoothing>0}set useThreshold(t){}get colorOutput(){return this.defines.COLOR!==void 0}set colorOutput(t){t?this.defines.COLOR="1":delete this.defines.COLOR,this.needsUpdate=!0}isColorOutputEnabled(t){return this.colorOutput}setColorOutputEnabled(t){this.colorOutput=t}get useRange(){return this.luminanceRange!==null}set useRange(t){this.luminanceRange=null}get luminanceRange(){return this.uniforms.range.value}set luminanceRange(t){t!==null?this.defines.RANGE="1":delete this.defines.RANGE,this.uniforms.range.value=t,this.needsUpdate=!0}getLuminanceRange(){return this.luminanceRange}setLuminanceRange(t){this.luminanceRange=t}},rx=class extends Wn{constructor({renderTarget:t,luminanceRange:i,colorOutput:a,resolutionScale:r=1,width:o=Un.AUTO_SIZE,height:c=Un.AUTO_SIZE,resolutionX:u=o,resolutionY:d=c}={}){super("LuminancePass"),this.fullscreenMaterial=new sx(a,i),this.needsSwap=!1,this.renderTarget=t,this.renderTarget===void 0&&(this.renderTarget=new $t(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="LuminancePass.Target");const p=this.resolution=new Un(this,u,d,r);p.addEventListener("change",g=>this.setSize(p.baseWidth,p.baseHeight))}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}getResolution(){return this.resolution}render(t,i,a,r,o){const c=this.fullscreenMaterial;c.inputBuffer=i.texture,t.setRenderTarget(this.renderToScreen?null:this.renderTarget),t.render(this.scene,this.camera)}setSize(t,i){const a=this.resolution;a.setBaseSize(t,i),this.renderTarget.setSize(a.width,a.height)}initialize(t,i,a){a!==void 0&&a!==Cn&&(this.renderTarget.texture.type=a,this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}},ox=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#define WEIGHT_INNER 0.125
#define WEIGHT_OUTER 0.0555555
varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;float clampToBorder(const in vec2 uv){return float(uv.s>=0.0&&uv.s<=1.0&&uv.t>=0.0&&uv.t<=1.0);}void main(){vec4 c=vec4(0.0);vec4 w=WEIGHT_INNER*vec4(clampToBorder(vUv00),clampToBorder(vUv01),clampToBorder(vUv02),clampToBorder(vUv03));c+=w.x*texture2D(inputBuffer,vUv00);c+=w.y*texture2D(inputBuffer,vUv01);c+=w.z*texture2D(inputBuffer,vUv02);c+=w.w*texture2D(inputBuffer,vUv03);w=WEIGHT_OUTER*vec4(clampToBorder(vUv04),clampToBorder(vUv05),clampToBorder(vUv06),clampToBorder(vUv07));c+=w.x*texture2D(inputBuffer,vUv04);c+=w.y*texture2D(inputBuffer,vUv05);c+=w.z*texture2D(inputBuffer,vUv06);c+=w.w*texture2D(inputBuffer,vUv07);w=WEIGHT_OUTER*vec4(clampToBorder(vUv08),clampToBorder(vUv09),clampToBorder(vUv10),clampToBorder(vUv11));c+=w.x*texture2D(inputBuffer,vUv08);c+=w.y*texture2D(inputBuffer,vUv09);c+=w.z*texture2D(inputBuffer,vUv10);c+=w.w*texture2D(inputBuffer,vUv11);c+=WEIGHT_OUTER*texture2D(inputBuffer,vUv);gl_FragColor=c;
#include <colorspace_fragment>
}`,lx="uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;void main(){vUv=position.xy*0.5+0.5;vUv00=vUv+texelSize*vec2(-1.0,1.0);vUv01=vUv+texelSize*vec2(1.0,1.0);vUv02=vUv+texelSize*vec2(-1.0,-1.0);vUv03=vUv+texelSize*vec2(1.0,-1.0);vUv04=vUv+texelSize*vec2(-2.0,2.0);vUv05=vUv+texelSize*vec2(0.0,2.0);vUv06=vUv+texelSize*vec2(2.0,2.0);vUv07=vUv+texelSize*vec2(-2.0,0.0);vUv08=vUv+texelSize*vec2(2.0,0.0);vUv09=vUv+texelSize*vec2(-2.0,-2.0);vUv10=vUv+texelSize*vec2(0.0,-2.0);vUv11=vUv+texelSize*vec2(2.0,-2.0);gl_Position=vec4(position.xy,1.0,1.0);}",cx=class extends rn{constructor(){super({name:"DownsamplingMaterial",uniforms:{inputBuffer:new it(null),texelSize:new it(new Ye)},blending:Xn,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:ox,vertexShader:lx})}set inputBuffer(t){this.uniforms.inputBuffer.value=t}setSize(t,i){this.uniforms.texelSize.value.set(1/t,1/i)}},ux=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;uniform mediump sampler2D supportBuffer;
#else
uniform lowp sampler2D inputBuffer;uniform lowp sampler2D supportBuffer;
#endif
uniform float radius;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vec4 c=vec4(0.0);c+=texture2D(inputBuffer,vUv0)*0.0625;c+=texture2D(inputBuffer,vUv1)*0.125;c+=texture2D(inputBuffer,vUv2)*0.0625;c+=texture2D(inputBuffer,vUv3)*0.125;c+=texture2D(inputBuffer,vUv)*0.25;c+=texture2D(inputBuffer,vUv4)*0.125;c+=texture2D(inputBuffer,vUv5)*0.0625;c+=texture2D(inputBuffer,vUv6)*0.125;c+=texture2D(inputBuffer,vUv7)*0.0625;vec4 baseColor=texture2D(supportBuffer,vUv);gl_FragColor=mix(baseColor,c,radius);
#include <colorspace_fragment>
}`,fx="uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,1.0);vUv1=vUv+texelSize*vec2(0.0,1.0);vUv2=vUv+texelSize*vec2(1.0,1.0);vUv3=vUv+texelSize*vec2(-1.0,0.0);vUv4=vUv+texelSize*vec2(1.0,0.0);vUv5=vUv+texelSize*vec2(-1.0,-1.0);vUv6=vUv+texelSize*vec2(0.0,-1.0);vUv7=vUv+texelSize*vec2(1.0,-1.0);gl_Position=vec4(position.xy,1.0,1.0);}",dx=class extends rn{constructor(){super({name:"UpsamplingMaterial",uniforms:{inputBuffer:new it(null),supportBuffer:new it(null),texelSize:new it(new Ye),radius:new it(.85)},blending:Xn,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:ux,vertexShader:fx})}set inputBuffer(t){this.uniforms.inputBuffer.value=t}set supportBuffer(t){this.uniforms.supportBuffer.value=t}get radius(){return this.uniforms.radius.value}set radius(t){this.uniforms.radius.value=t}setSize(t,i){this.uniforms.texelSize.value.set(1/t,1/i)}},px=class extends Wn{constructor(){super("MipmapBlurPass"),this.needsSwap=!1,this.renderTarget=new $t(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="Upsampling.Mipmap0",this.downsamplingMipmaps=[],this.upsamplingMipmaps=[],this.downsamplingMaterial=new cx,this.upsamplingMaterial=new dx,this.resolution=new Ye}get texture(){return this.renderTarget.texture}get levels(){return this.downsamplingMipmaps.length}set levels(t){if(this.levels!==t){const i=this.renderTarget;this.dispose(),this.downsamplingMipmaps=[],this.upsamplingMipmaps=[];for(let a=0;a<t;++a){const r=i.clone();r.texture.name="Downsampling.Mipmap"+a,this.downsamplingMipmaps.push(r)}this.upsamplingMipmaps.push(i);for(let a=1,r=t-1;a<r;++a){const o=i.clone();o.texture.name="Upsampling.Mipmap"+a,this.upsamplingMipmaps.push(o)}this.setSize(this.resolution.x,this.resolution.y)}}get radius(){return this.upsamplingMaterial.radius}set radius(t){this.upsamplingMaterial.radius=t}render(t,i,a,r,o){const{scene:c,camera:u}=this,{downsamplingMaterial:d,upsamplingMaterial:p}=this,{downsamplingMipmaps:g,upsamplingMipmaps:E}=this;let _=i;this.fullscreenMaterial=d;for(let v=0,S=g.length;v<S;++v){const U=g[v];d.setSize(_.width,_.height),d.inputBuffer=_.texture,t.setRenderTarget(U),t.render(c,u),_=U}this.fullscreenMaterial=p;for(let v=E.length-1;v>=0;--v){const S=E[v];p.setSize(_.width,_.height),p.inputBuffer=_.texture,p.supportBuffer=g[v].texture,t.setRenderTarget(S),t.render(c,u),_=S}}setSize(t,i){const a=this.resolution;a.set(t,i);let r=a.width,o=a.height;for(let c=0,u=this.downsamplingMipmaps.length;c<u;++c)r=Math.round(r*.5),o=Math.round(o*.5),this.downsamplingMipmaps[c].setSize(r,o),c<this.upsamplingMipmaps.length&&this.upsamplingMipmaps[c].setSize(r,o)}initialize(t,i,a){if(a!==void 0){const r=this.downsamplingMipmaps.concat(this.upsamplingMipmaps);for(const o of r)o.texture.type=a;if(a!==Cn)this.downsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1",this.upsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1";else if(t!==null&&t.outputColorSpace===vn)for(const o of r)o.texture.colorSpace=vn}}dispose(){super.dispose();for(const t of this.downsamplingMipmaps.concat(this.upsamplingMipmaps))t.dispose()}},hx=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D map;
#else
uniform lowp sampler2D map;
#endif
uniform float intensity;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec4 texel=texture2D(map,uv);outputColor=vec4(texel.rgb*intensity,max(inputColor.a,texel.a));}`,mx=class extends Zs{constructor({blendFunction:t=ht.SCREEN,luminanceThreshold:i=1,luminanceSmoothing:a=.03,mipmapBlur:r=!0,intensity:o=1,radius:c=.85,levels:u=8,kernelSize:d=Zu.LARGE,resolutionScale:p=.5,width:g=Un.AUTO_SIZE,height:E=Un.AUTO_SIZE,resolutionX:_=g,resolutionY:v=E}={}){super("BloomEffect",hx,{blendFunction:t,uniforms:new Map([["map",new it(null)],["intensity",new it(o)]])}),this.renderTarget=new $t(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="Bloom.Target",this.blurPass=new ix({kernelSize:d}),this.luminancePass=new rx({colorOutput:!0}),this.luminanceMaterial.threshold=i,this.luminanceMaterial.smoothing=a,this.mipmapBlurPass=new px,this.mipmapBlurPass.enabled=r,this.mipmapBlurPass.radius=c,this.mipmapBlurPass.levels=u,this.uniforms.get("map").value=r?this.mipmapBlurPass.texture:this.renderTarget.texture;const S=this.resolution=new Un(this,_,v,p);S.addEventListener("change",U=>this.setSize(S.baseWidth,S.baseHeight))}get texture(){return this.mipmapBlurPass.enabled?this.mipmapBlurPass.texture:this.renderTarget.texture}getTexture(){return this.texture}getResolution(){return this.resolution}getBlurPass(){return this.blurPass}getLuminancePass(){return this.luminancePass}get luminanceMaterial(){return this.luminancePass.fullscreenMaterial}getLuminanceMaterial(){return this.luminancePass.fullscreenMaterial}get width(){return this.resolution.width}set width(t){this.resolution.preferredWidth=t}get height(){return this.resolution.height}set height(t){this.resolution.preferredHeight=t}get dithering(){return this.blurPass.dithering}set dithering(t){this.blurPass.dithering=t}get kernelSize(){return this.blurPass.kernelSize}set kernelSize(t){this.blurPass.kernelSize=t}get distinction(){return console.warn(this.name,"distinction was removed"),1}set distinction(t){console.warn(this.name,"distinction was removed")}get intensity(){return this.uniforms.get("intensity").value}set intensity(t){this.uniforms.get("intensity").value=t}getIntensity(){return this.intensity}setIntensity(t){this.intensity=t}getResolutionScale(){return this.resolution.scale}setResolutionScale(t){this.resolution.scale=t}update(t,i,a){const r=this.renderTarget,o=this.luminancePass;o.enabled?(o.render(t,i),this.mipmapBlurPass.enabled?this.mipmapBlurPass.render(t,o.renderTarget):this.blurPass.render(t,o.renderTarget,r)):this.mipmapBlurPass.enabled?this.mipmapBlurPass.render(t,i):this.blurPass.render(t,i,r)}setSize(t,i){const a=this.resolution;a.setBaseSize(t,i),this.renderTarget.setSize(a.width,a.height),this.blurPass.resolution.copy(a),this.luminancePass.setSize(t,i),this.mipmapBlurPass.setSize(t,i)}initialize(t,i,a){this.blurPass.initialize(t,i,a),this.luminancePass.initialize(t,i,a),this.mipmapBlurPass.initialize(t,i,a),a!==void 0&&(this.renderTarget.texture.type=a,t!==null&&t.outputColorSpace===vn&&(this.renderTarget.texture.colorSpace=vn))}},vx=`#ifdef RADIAL_MODULATION
uniform float modulationOffset;
#endif
varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 ra=inputColor.ra;vec2 ba=inputColor.ba;
#ifdef RADIAL_MODULATION
const vec2 center=vec2(0.5);float d=distance(uv,center)*2.0;d=max(d-modulationOffset,0.0);if(vActive>0.0&&d>0.0){ra=texture2D(inputBuffer,mix(uv,vUvR,d)).ra;ba=texture2D(inputBuffer,mix(uv,vUvB,d)).ba;}
#else
if(vActive>0.0){ra=texture2D(inputBuffer,vUvR).ra;ba=texture2D(inputBuffer,vUvB).ba;}
#endif
outputColor=vec4(ra.x,inputColor.g,ba.x,max(max(ra.y,ba.y),inputColor.a));}`,gx="uniform vec2 offset;varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainSupport(const in vec2 uv){vec2 shift=offset*vec2(1.0,aspect);vActive=(shift.x!=0.0||shift.y!=0.0)?1.0:0.0;vUvR=uv+shift;vUvB=uv-shift;}",_x=class extends Zs{constructor({offset:t=new Ye(.001,5e-4),radialModulation:i=!1,modulationOffset:a=.15}={}){super("ChromaticAberrationEffect",vx,{vertexShader:gx,attributes:wa.CONVOLUTION,uniforms:new Map([["offset",new it(t)],["modulationOffset",new it(a)]])}),this.radialModulation=i}get offset(){return this.uniforms.get("offset").value}set offset(t){this.uniforms.get("offset").value=t}get radialModulation(){return this.defines.has("RADIAL_MODULATION")}set radialModulation(t){t?this.defines.set("RADIAL_MODULATION","1"):this.defines.delete("RADIAL_MODULATION"),this.setChanged()}get modulationOffset(){return this.uniforms.get("modulationOffset").value}set modulationOffset(t){this.uniforms.get("modulationOffset").value=t}getOffset(){return this.offset}setOffset(t){this.offset=t}},Ua={DISABLED:0,SPORADIC:1,CONSTANT_MILD:2,CONSTANT_WILD:3};function Sx(t,i,a){const r=new Map([[qu,1],[im,2],[bn,4]]);let o;if(r.has(i)||console.error("Invalid noise texture format"),a===Cn){o=new Uint8Array(t*r.get(i));for(let c=0,u=o.length;c<u;++c)o[c]=Math.random()*255+.5}else{o=new Float32Array(t*r.get(i));for(let c=0,u=o.length;c<u;++c)o[c]=Math.random()}return o}var Rh=class extends Ru{constructor(t,i,a=qu,r=Cn){super(Sx(t*i,a,r),t,i,a,r),this.needsUpdate=!0}},Ex="uniform lowp sampler2D perturbationMap;uniform bool active;uniform float columns;uniform float random;uniform vec2 seeds;uniform vec2 distortion;void mainUv(inout vec2 uv){if(active){if(uv.y<distortion.x+columns&&uv.y>distortion.x-columns*random){float sx=clamp(ceil(seeds.x),0.0,1.0);uv.y=sx*(1.0-(uv.y+distortion.y))+(1.0-sx)*distortion.y;}if(uv.x<distortion.y+columns&&uv.x>distortion.y-columns*random){float sy=clamp(ceil(seeds.y),0.0,1.0);uv.x=sy*distortion.x+(1.0-sy)*(1.0-(uv.x+distortion.x));}vec2 normal=texture2D(perturbationMap,uv*random*random).rg;uv+=normal*seeds*(random*0.2);}}",Fo="Glitch.Generated";function zn(t,i){return t+Math.random()*(i-t)}var Tx=class extends Zs{constructor({chromaticAberrationOffset:t=null,delay:i=new Ye(1.5,3.5),duration:a=new Ye(.6,1),strength:r=new Ye(.3,1),columns:o=.05,ratio:c=.85,perturbationMap:u=null,dtSize:d=64}={}){if(super("GlitchEffect",Ex,{uniforms:new Map([["perturbationMap",new it(null)],["columns",new it(o)],["active",new it(!1)],["random",new it(1)],["seeds",new it(new Ye)],["distortion",new it(new Ye)]])}),u===null){const p=new Rh(d,d,bn);p.name=Fo,this.perturbationMap=p}else this.perturbationMap=u;this.time=0,this.distortion=this.uniforms.get("distortion").value,this.delay=i,this.duration=a,this.breakPoint=new Ye(zn(this.delay.x,this.delay.y),zn(this.duration.x,this.duration.y)),this.strength=r,this.mode=Ua.SPORADIC,this.ratio=c,this.chromaticAberrationOffset=t}get seeds(){return this.uniforms.get("seeds").value}get active(){return this.uniforms.get("active").value}isActive(){return this.active}get minDelay(){return this.delay.x}set minDelay(t){this.delay.x=t}getMinDelay(){return this.delay.x}setMinDelay(t){this.delay.x=t}get maxDelay(){return this.delay.y}set maxDelay(t){this.delay.y=t}getMaxDelay(){return this.delay.y}setMaxDelay(t){this.delay.y=t}get minDuration(){return this.duration.x}set minDuration(t){this.duration.x=t}getMinDuration(){return this.duration.x}setMinDuration(t){this.duration.x=t}get maxDuration(){return this.duration.y}set maxDuration(t){this.duration.y=t}getMaxDuration(){return this.duration.y}setMaxDuration(t){this.duration.y=t}get minStrength(){return this.strength.x}set minStrength(t){this.strength.x=t}getMinStrength(){return this.strength.x}setMinStrength(t){this.strength.x=t}get maxStrength(){return this.strength.y}set maxStrength(t){this.strength.y=t}getMaxStrength(){return this.strength.y}setMaxStrength(t){this.strength.y=t}getMode(){return this.mode}setMode(t){this.mode=t}getGlitchRatio(){return 1-this.ratio}setGlitchRatio(t){this.ratio=Math.min(Math.max(1-t,0),1)}get columns(){return this.uniforms.get("columns").value}set columns(t){this.uniforms.get("columns").value=t}getGlitchColumns(){return this.columns}setGlitchColumns(t){this.columns=t}getChromaticAberrationOffset(){return this.chromaticAberrationOffset}setChromaticAberrationOffset(t){this.chromaticAberrationOffset=t}get perturbationMap(){return this.uniforms.get("perturbationMap").value}set perturbationMap(t){const i=this.perturbationMap;i!==null&&i.name===Fo&&i.dispose(),t.minFilter=t.magFilter=yi,t.wrapS=t.wrapT=Qh,t.generateMipmaps=!1,this.uniforms.get("perturbationMap").value=t}getPerturbationMap(){return this.perturbationMap}setPerturbationMap(t){this.perturbationMap=t}generatePerturbationMap(t=64){const i=new Rh(t,t,bn);return i.name=Fo,i}update(t,i,a){const r=this.mode,o=this.breakPoint,c=this.chromaticAberrationOffset,u=this.strength;let d=this.time,p=!1,g=0,E=0,_;r!==Ua.DISABLED&&(r===Ua.SPORADIC&&(d+=a,_=d>o.x,d>=o.x+o.y&&(o.set(zn(this.delay.x,this.delay.y),zn(this.duration.x,this.duration.y)),d=0)),g=Math.random(),this.uniforms.get("random").value=g,_&&g>this.ratio||r===Ua.CONSTANT_WILD?(p=!0,g*=u.y*.03,E=zn(-Math.PI,Math.PI),this.seeds.set(zn(-u.y,u.y),zn(-u.y,u.y)),this.distortion.set(zn(0,1),zn(0,1))):(_||r===Ua.CONSTANT_MILD)&&(p=!0,g*=u.x*.03,E=zn(-Math.PI,Math.PI),this.seeds.set(zn(-u.x,u.x),zn(-u.x,u.x)),this.distortion.set(zn(0,1),zn(0,1))),this.time=d),c!==null&&(p?c.set(Math.cos(E),Math.sin(E)).multiplyScalar(g):c.set(0,0)),this.uniforms.get("active").value=p}dispose(){const t=this.perturbationMap;t!==null&&t.name===Fo&&t.dispose()}},ju=class extends Wn{constructor(t,i,a=null){super("RenderPass",t,i),this.needsSwap=!1,this.clearPass=new ym,this.overrideMaterialManager=a===null?null:new Ah(a),this.ignoreBackground=!1,this.skipShadowMapUpdate=!1,this.selection=null}set mainScene(t){this.scene=t}set mainCamera(t){this.camera=t}get renderToScreen(){return super.renderToScreen}set renderToScreen(t){super.renderToScreen=t,this.clearPass.renderToScreen=t}get overrideMaterial(){const t=this.overrideMaterialManager;return t!==null?t.material:null}set overrideMaterial(t){const i=this.overrideMaterialManager;t!==null?i!==null?i.setMaterial(t):this.overrideMaterialManager=new Ah(t):i!==null&&(i.dispose(),this.overrideMaterialManager=null)}getOverrideMaterial(){return this.overrideMaterial}setOverrideMaterial(t){this.overrideMaterial=t}get clear(){return this.clearPass.enabled}set clear(t){this.clearPass.enabled=t}getSelection(){return this.selection}setSelection(t){this.selection=t}isBackgroundDisabled(){return this.ignoreBackground}setBackgroundDisabled(t){this.ignoreBackground=t}isShadowMapDisabled(){return this.skipShadowMapUpdate}setShadowMapDisabled(t){this.skipShadowMapUpdate=t}getClearPass(){return this.clearPass}render(t,i,a,r,o){const c=this.scene,u=this.camera,d=this.selection,p=u.layers.mask,g=c.background,E=t.shadowMap.autoUpdate,_=this.renderToScreen?null:i;d!==null&&u.layers.set(d.getLayer()),this.skipShadowMapUpdate&&(t.shadowMap.autoUpdate=!1),(this.ignoreBackground||this.clearPass.overrideClearColor!==null)&&(c.background=null),this.clearPass.enabled&&this.clearPass.render(t,i),t.setRenderTarget(_),this.overrideMaterialManager!==null?this.overrideMaterialManager.render(t,c,u):t.render(c,u),u.layers.mask=p,c.background=g,t.shadowMap.autoUpdate=E}},wr={DEFAULT:0,ESKIL:1},Mx=`#include <packing>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
#ifdef DOWNSAMPLE_NORMALS
uniform lowp sampler2D normalBuffer;
#endif
varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}int findBestDepth(const in float samples[4]){float c=(samples[0]+samples[1]+samples[2]+samples[3])*0.25;float distances[4];distances[0]=abs(c-samples[0]);distances[1]=abs(c-samples[1]);distances[2]=abs(c-samples[2]);distances[3]=abs(c-samples[3]);float maxDistance=max(max(distances[0],distances[1]),max(distances[2],distances[3]));int remaining[3];int rejected[3];int i,j,k;for(i=0,j=0,k=0;i<4;++i){if(distances[i]<maxDistance){remaining[j++]=i;}else{rejected[k++]=i;}}for(;j<3;++j){remaining[j]=rejected[--k];}vec3 s=vec3(samples[remaining[0]],samples[remaining[1]],samples[remaining[2]]);c=(s.x+s.y+s.z)/3.0;distances[0]=abs(c-s.x);distances[1]=abs(c-s.y);distances[2]=abs(c-s.z);float minDistance=min(distances[0],min(distances[1],distances[2]));for(i=0;i<3;++i){if(distances[i]==minDistance){break;}}return remaining[i];}void main(){float d[4];d[0]=readDepth(vUv0);d[1]=readDepth(vUv1);d[2]=readDepth(vUv2);d[3]=readDepth(vUv3);int index=findBestDepth(d);
#ifdef DOWNSAMPLE_NORMALS
vec3 n[4];n[0]=texture2D(normalBuffer,vUv0).rgb;n[1]=texture2D(normalBuffer,vUv1).rgb;n[2]=texture2D(normalBuffer,vUv2).rgb;n[3]=texture2D(normalBuffer,vUv3).rgb;
#else
vec3 n[4];n[0]=vec3(0.0);n[1]=vec3(0.0);n[2]=vec3(0.0);n[3]=vec3(0.0);
#endif
gl_FragColor=vec4(n[index],d[index]);}`,yx="uniform vec2 texelSize;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vUv0=uv;vUv1=vec2(uv.x,uv.y+texelSize.y);vUv2=vec2(uv.x+texelSize.x,uv.y);vUv3=uv+texelSize;gl_Position=vec4(position.xy,1.0,1.0);}",xx=class extends rn{constructor(){super({name:"DepthDownsamplingMaterial",defines:{DEPTH_PACKING:"0"},uniforms:{depthBuffer:new it(null),normalBuffer:new it(null),texelSize:new it(new Ye)},blending:Xn,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:Mx,vertexShader:yx})}set depthBuffer(t){this.uniforms.depthBuffer.value=t}set depthPacking(t){this.defines.DEPTH_PACKING=t.toFixed(0),this.needsUpdate=!0}setDepthBuffer(t,i=Js){this.depthBuffer=t,this.depthPacking=i}set normalBuffer(t){this.uniforms.normalBuffer.value=t,t!==null?this.defines.DOWNSAMPLE_NORMALS="1":delete this.defines.DOWNSAMPLE_NORMALS,this.needsUpdate=!0}setNormalBuffer(t){this.normalBuffer=t}setTexelSize(t,i){this.uniforms.texelSize.value.set(t,i)}setSize(t,i){this.uniforms.texelSize.value.set(1/t,1/i)}},Ax=class extends Wn{constructor({normalBuffer:t=null,resolutionScale:i=.5,width:a=Un.AUTO_SIZE,height:r=Un.AUTO_SIZE,resolutionX:o=a,resolutionY:c=r}={}){super("DepthDownsamplingPass");const u=new xx;u.normalBuffer=t,this.fullscreenMaterial=u,this.needsDepthTexture=!0,this.needsSwap=!1,this.renderTarget=new $t(1,1,{minFilter:yi,magFilter:yi,depthBuffer:!1,type:_i}),this.renderTarget.texture.name="DepthDownsamplingPass.Target",this.renderTarget.texture.generateMipmaps=!1;const d=this.resolution=new Un(this,o,c,i);d.addEventListener("change",p=>this.setSize(d.baseWidth,d.baseHeight))}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}getResolution(){return this.resolution}setDepthTexture(t,i=Js){this.fullscreenMaterial.depthBuffer=t,this.fullscreenMaterial.depthPacking=i}render(t,i,a,r,o){t.setRenderTarget(this.renderToScreen?null:this.renderTarget),t.render(this.scene,this.camera)}setSize(t,i){const a=this.resolution;a.setBaseSize(t,i),this.renderTarget.setSize(a.width,a.height),this.fullscreenMaterial.setSize(t,i)}initialize(t,i,a){const r=t.getContext();if(!(r.getExtension("EXT_color_buffer_float")||r.getExtension("EXT_color_buffer_half_float")))throw new Error("Rendering to float texture is not supported.")}},Rx=`uniform float offset;uniform float darkness;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){const vec2 center=vec2(0.5);vec3 color=inputColor.rgb;
#if VIGNETTE_TECHNIQUE == 0
float d=distance(uv,center);color*=smoothstep(0.8,offset*0.799,d*(darkness+offset));
#else
vec2 coord=(uv-center)*vec2(offset);color=mix(color,vec3(1.0-darkness),dot(coord,coord));
#endif
outputColor=vec4(color,inputColor.a);}`,bx=class extends Zs{constructor({blendFunction:t,eskil:i=!1,technique:a=i?wr.ESKIL:wr.DEFAULT,offset:r=.5,darkness:o=.5}={}){super("VignetteEffect",Rx,{blendFunction:t,defines:new Map([["VIGNETTE_TECHNIQUE",a.toFixed(0)]]),uniforms:new Map([["offset",new it(r)],["darkness",new it(o)]])})}get technique(){return Number(this.defines.get("VIGNETTE_TECHNIQUE"))}set technique(t){this.technique!==t&&(this.defines.set("VIGNETTE_TECHNIQUE",t.toFixed(0)),this.setChanged())}get eskil(){return this.technique===wr.ESKIL}set eskil(t){this.technique=t?wr.ESKIL:wr.DEFAULT}getTechnique(){return this.technique}setTechnique(t){this.technique=t}get offset(){return this.uniforms.get("offset").value}set offset(t){this.uniforms.get("offset").value=t}getOffset(){return this.offset}setOffset(t){this.offset=t}get darkness(){return this.uniforms.get("darkness").value}set darkness(t){this.uniforms.get("darkness").value=t}getDarkness(){return this.darkness}setDarkness(t){this.darkness=t}},Ux=`#include <common>
#include <packing>
#include <dithering_pars_fragment>
#define packFloatToRGBA(v) packDepthToRGBA(v)
#define unpackRGBAToFloat(v) unpackRGBAToDepth(v)
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#if DEPTH_PACKING == 3201
uniform lowp sampler2D depthBuffer;
#elif defined(GL_FRAGMENT_PRECISION_HIGH)
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;vec4 sRGBToLinear(const in vec4 value){return vec4(mix(pow(value.rgb*0.9478672986+vec3(0.0521327014),vec3(2.4)),value.rgb*0.0773993808,vec3(lessThanEqual(value.rgb,vec3(0.04045)))),value.a);}float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
float depth=unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
float depth=texture2D(depthBuffer,uv).r;
#endif
#if defined(USE_LOGARITHMIC_DEPTH_BUFFER) || defined(LOG_DEPTH)
float d=pow(2.0,depth*log2(cameraFar+1.0))-1.0;float a=cameraFar/(cameraFar-cameraNear);float b=cameraFar*cameraNear/(cameraNear-cameraFar);depth=a+b/d;
#elif defined(USE_REVERSED_DEPTH_BUFFER)
depth=1.0-depth;
#endif
return depth;}float getViewZ(const in float depth){
#ifdef PERSPECTIVE_CAMERA
return perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
#else
return orthographicDepthToViewZ(depth,cameraNear,cameraFar);
#endif
}vec3 RGBToHCV(const in vec3 RGB){vec4 P=mix(vec4(RGB.bg,-1.0,2.0/3.0),vec4(RGB.gb,0.0,-1.0/3.0),step(RGB.b,RGB.g));vec4 Q=mix(vec4(P.xyw,RGB.r),vec4(RGB.r,P.yzx),step(P.x,RGB.r));float C=Q.x-min(Q.w,Q.y);float H=abs((Q.w-Q.y)/(6.0*C+EPSILON)+Q.z);return vec3(H,C,Q.x);}vec3 RGBToHSL(const in vec3 RGB){vec3 HCV=RGBToHCV(RGB);float L=HCV.z-HCV.y*0.5;float S=HCV.y/(1.0-abs(L*2.0-1.0)+EPSILON);return vec3(HCV.x,S,L);}vec3 HueToRGB(const in float H){float R=abs(H*6.0-3.0)-1.0;float G=2.0-abs(H*6.0-2.0);float B=2.0-abs(H*6.0-4.0);return clamp(vec3(R,G,B),0.0,1.0);}vec3 HSLToRGB(const in vec3 HSL){vec3 RGB=HueToRGB(HSL.x);float C=(1.0-abs(2.0*HSL.z-1.0))*HSL.y;return(RGB-0.5)*C+HSL.z;}FRAGMENT_HEAD void main(){FRAGMENT_MAIN_UV vec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGE color0.a=clamp(color0.a,0.0,1.0);gl_FragColor=color0;
#ifdef ENCODE_OUTPUT
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
}`,Cx="uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}",Dx=class extends rn{constructor(t,i,a,r,o=!1){super({name:"EffectMaterial",defines:{THREE_REVISION:Gu.replace(/\D+/g,""),DEPTH_PACKING:"0",ENCODE_OUTPUT:"1"},uniforms:{inputBuffer:new it(null),depthBuffer:new it(null),resolution:new it(new Ye),texelSize:new it(new Ye),cameraNear:new it(.3),cameraFar:new it(1e3),aspect:new it(1),time:new it(0)},blending:Xn,toneMapped:!1,depthWrite:!1,depthTest:!1,dithering:o}),t&&this.setShaderParts(t),i&&this.setDefines(i),a&&this.setUniforms(a),this.copyCameraSettings(r)}set inputBuffer(t){this.uniforms.inputBuffer.value=t}setInputBuffer(t){this.uniforms.inputBuffer.value=t}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(t){this.uniforms.depthBuffer.value=t}get depthPacking(){return Number(this.defines.DEPTH_PACKING)}set depthPacking(t){this.defines.DEPTH_PACKING=t.toFixed(0),this.needsUpdate=!0}setDepthBuffer(t,i=Js){this.depthBuffer=t,this.depthPacking=i}setShaderData(t){this.setShaderParts(t.shaderParts),this.setDefines(t.defines),this.setUniforms(t.uniforms),this.setExtensions(t.extensions)}setShaderParts(t){return this.fragmentShader=Ux.replace(At.FRAGMENT_HEAD,t.get(At.FRAGMENT_HEAD)||"").replace(At.FRAGMENT_MAIN_UV,t.get(At.FRAGMENT_MAIN_UV)||"").replace(At.FRAGMENT_MAIN_IMAGE,t.get(At.FRAGMENT_MAIN_IMAGE)||""),this.vertexShader=Cx.replace(At.VERTEX_HEAD,t.get(At.VERTEX_HEAD)||"").replace(At.VERTEX_MAIN_SUPPORT,t.get(At.VERTEX_MAIN_SUPPORT)||""),this.needsUpdate=!0,this}setDefines(t){for(const i of t.entries())this.defines[i[0]]=i[1];return this.needsUpdate=!0,this}setUniforms(t){for(const i of t.entries())this.uniforms[i[0]]=i[1];return this}setExtensions(t){this.extensions={};for(const i of t)this.extensions[i]=!0;return this}get encodeOutput(){return this.defines.ENCODE_OUTPUT!==void 0}set encodeOutput(t){this.encodeOutput!==t&&(t?this.defines.ENCODE_OUTPUT="1":delete this.defines.ENCODE_OUTPUT,this.needsUpdate=!0)}isOutputEncodingEnabled(t){return this.encodeOutput}setOutputEncodingEnabled(t){this.encodeOutput=t}get time(){return this.uniforms.time.value}set time(t){this.uniforms.time.value=t}setDeltaTime(t){this.uniforms.time.value+=t}adoptCameraSettings(t){this.copyCameraSettings(t)}copyCameraSettings(t){t&&(this.uniforms.cameraNear.value=t.near,this.uniforms.cameraFar.value=t.far,t instanceof Ws?this.defines.PERSPECTIVE_CAMERA="1":delete this.defines.PERSPECTIVE_CAMERA,this.needsUpdate=!0)}setSize(t,i){const a=this.uniforms;a.resolution.value.set(t,i),a.texelSize.value.set(1/t,1/i),a.aspect.value=t/i}static get Section(){return At}};function bh(t,i,a){for(const r of i){const o="$1"+t+r.charAt(0).toUpperCase()+r.slice(1),c=new RegExp("([^\\.])(\\b"+r+"\\b)","g");for(const u of a.entries())u[1]!==null&&a.set(u[0],u[1].replace(c,o))}}function wx(t,i,a){let r=i.getFragmentShader(),o=i.getVertexShader();const c=r!==void 0&&/mainImage/.test(r),u=r!==void 0&&/mainUv/.test(r);if(a.attributes|=i.getAttributes(),r===void 0)throw new Error(`Missing fragment shader (${i.name})`);if(u&&(a.attributes&wa.CONVOLUTION)!==0)throw new Error(`Effects that transform UVs are incompatible with convolution effects (${i.name})`);if(!c&&!u)throw new Error(`Could not find mainImage or mainUv function (${i.name})`);{const d=/\w+\s+(\w+)\([\w\s,]*\)\s*{/g,p=a.shaderParts;let g=p.get(At.FRAGMENT_HEAD)||"",E=p.get(At.FRAGMENT_MAIN_UV)||"",_=p.get(At.FRAGMENT_MAIN_IMAGE)||"",v=p.get(At.VERTEX_HEAD)||"",S=p.get(At.VERTEX_MAIN_SUPPORT)||"";const U=new Set,w=new Set;if(u&&(E+=`	${t}MainUv(UV);
`,a.uvTransformation=!0),o!==null&&/mainSupport/.test(o)){const x=/mainSupport *\([\w\s]*?uv\s*?\)/.test(o);S+=`	${t}MainSupport(`,S+=x?`vUv);
`:`);
`;for(const R of o.matchAll(/(?:varying\s+\w+\s+([\S\s]*?);)/g))for(const b of R[1].split(/\s*,\s*/))a.varyings.add(b),U.add(b),w.add(b);for(const R of o.matchAll(d))w.add(R[1])}for(const x of r.matchAll(d))w.add(x[1]);for(const x of i.defines.keys())w.add(x.replace(/\([\w\s,]*\)/g,""));for(const x of i.uniforms.keys())w.add(x);w.delete("while"),w.delete("for"),w.delete("if"),i.uniforms.forEach((x,R)=>a.uniforms.set(t+R.charAt(0).toUpperCase()+R.slice(1),x)),i.defines.forEach((x,R)=>a.defines.set(t+R.charAt(0).toUpperCase()+R.slice(1),x));const T=new Map([["fragment",r],["vertex",o]]);bh(t,w,a.defines),bh(t,w,T),r=T.get("fragment"),o=T.get("vertex");const m=i.blendMode;if(a.blendModes.set(m.blendFunction,m),c){i.inputColorSpace!==null&&i.inputColorSpace!==a.colorSpace&&(_+=i.inputColorSpace===vn?`color0 = sRGBTransferOETF(color0);
	`:`color0 = sRGBToLinear(color0);
	`),i.outputColorSpace!==ba?a.colorSpace=i.outputColorSpace:i.inputColorSpace!==null&&(a.colorSpace=i.inputColorSpace);const x=/MainImage *\([\w\s,]*?depth[\w\s,]*?\)/;_+=`${t}MainImage(color0, UV, `,(a.attributes&wa.DEPTH)!==0&&x.test(r)&&(_+="depth, ",a.readDepth=!0),_+=`color1);
	`;const R=t+"BlendOpacity";a.uniforms.set(R,m.opacity),_+=`color0 = blend${m.blendFunction}(color0, color1, ${R});

	`,g+=`uniform float ${R};

`}if(g+=r+`
`,o!==null&&(v+=o+`
`),p.set(At.FRAGMENT_HEAD,g),p.set(At.FRAGMENT_MAIN_UV,E),p.set(At.FRAGMENT_MAIN_IMAGE,_),p.set(At.VERTEX_HEAD,v),p.set(At.VERTEX_MAIN_SUPPORT,S),i.extensions!==null)for(const x of i.extensions)a.extensions.add(x)}}var Px=class extends Wn{constructor(t,...i){super("EffectPass"),this.fullscreenMaterial=new Dx(null,null,null,t),this.listener=a=>this.handleEvent(a),this.effects=[],this.setEffects(i),this.skipRendering=!1,this.minTime=1,this.maxTime=Number.POSITIVE_INFINITY,this.timeScale=1}set mainScene(t){for(const i of this.effects)i.mainScene=t}set mainCamera(t){this.fullscreenMaterial.copyCameraSettings(t);for(const i of this.effects)i.mainCamera=t}get encodeOutput(){return this.fullscreenMaterial.encodeOutput}set encodeOutput(t){this.fullscreenMaterial.encodeOutput=t}get dithering(){return this.fullscreenMaterial.dithering}set dithering(t){const i=this.fullscreenMaterial;i.dithering=t,i.needsUpdate=!0}setEffects(t){for(const i of this.effects)i.removeEventListener("change",this.listener);this.effects=t.sort((i,a)=>a.attributes-i.attributes);for(const i of this.effects)i.addEventListener("change",this.listener)}updateMaterial(){const t=new Sy;let i=0;for(const u of this.effects)if(u.blendMode.blendFunction===ht.DST)t.attributes|=u.getAttributes()&wa.DEPTH;else{if((t.attributes&u.getAttributes()&wa.CONVOLUTION)!==0)throw new Error(`Convolution effects cannot be merged (${u.name})`);wx("e"+i++,u,t)}let a=t.shaderParts.get(At.FRAGMENT_HEAD),r=t.shaderParts.get(At.FRAGMENT_MAIN_IMAGE),o=t.shaderParts.get(At.FRAGMENT_MAIN_UV);const c=/\bblend\b/g;for(const u of t.blendModes.values())a+=u.getShaderCode().replace(c,`blend${u.blendFunction}`)+`
`;(t.attributes&wa.DEPTH)!==0?(t.readDepth&&(r=`float depth = readDepth(UV);

	`+r),this.needsDepthTexture=this.getDepthTexture()===null):this.needsDepthTexture=!1,t.colorSpace===vn&&(r+=`color0 = sRGBToLinear(color0);
	`),t.uvTransformation?(o=`vec2 transformedUv = vUv;
`+o,t.defines.set("UV","transformedUv")):t.defines.set("UV","vUv"),t.shaderParts.set(At.FRAGMENT_HEAD,a),t.shaderParts.set(At.FRAGMENT_MAIN_IMAGE,r),t.shaderParts.set(At.FRAGMENT_MAIN_UV,o);for(const[u,d]of t.shaderParts)d!==null&&t.shaderParts.set(u,d.trim().replace(/^#/,`
#`));this.skipRendering=i===0,this.needsSwap=!this.skipRendering,this.fullscreenMaterial.setShaderData(t)}recompile(){this.updateMaterial()}getDepthTexture(){return this.fullscreenMaterial.depthBuffer}setDepthTexture(t,i=Js){this.fullscreenMaterial.depthBuffer=t,this.fullscreenMaterial.depthPacking=i;for(const a of this.effects)a.setDepthTexture(t,i)}render(t,i,a,r,o){for(const c of this.effects)c.update(t,i,r);if(!this.skipRendering||this.renderToScreen){const c=this.fullscreenMaterial;c.inputBuffer=i.texture,c.time+=r*this.timeScale,t.setRenderTarget(this.renderToScreen?null:a),t.render(this.scene,this.camera)}}setSize(t,i){this.fullscreenMaterial.setSize(t,i);for(const a of this.effects)a.setSize(t,i)}initialize(t,i,a){this.renderer=t;for(const r of this.effects)r.initialize(t,i,a);this.updateMaterial(),a!==void 0&&a!==Cn&&(this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}dispose(){super.dispose();for(const t of this.effects)t.removeEventListener("change",this.listener),t.dispose()}handleEvent(t){switch(t.type){case"change":this.recompile();break}}},Nx=class extends Wn{constructor(t,i,{renderTarget:a,resolutionScale:r=1,width:o=Un.AUTO_SIZE,height:c=Un.AUTO_SIZE,resolutionX:u=o,resolutionY:d=c}={}){super("NormalPass"),this.needsSwap=!1,this.renderPass=new ju(t,i,new Z_);const p=this.renderPass;p.ignoreBackground=!0,p.skipShadowMapUpdate=!0;const g=p.getClearPass();g.overrideClearColor=new at(7829503),g.overrideClearAlpha=1,this.renderTarget=a,this.renderTarget===void 0&&(this.renderTarget=new $t(1,1,{minFilter:yi,magFilter:yi}),this.renderTarget.texture.name="NormalPass.Target");const E=this.resolution=new Un(this,u,d,r);E.addEventListener("change",_=>this.setSize(E.baseWidth,E.baseHeight))}set mainScene(t){this.renderPass.mainScene=t}set mainCamera(t){this.renderPass.mainCamera=t}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}getResolution(){return this.resolution}getResolutionScale(){return this.resolution.scale}setResolutionScale(t){this.resolution.scale=t}render(t,i,a,r,o){const c=this.renderToScreen?null:this.renderTarget;this.renderPass.render(t,c,c)}setSize(t,i){const a=this.resolution;a.setBaseSize(t,i),this.renderTarget.setSize(a.width,a.height)}};function Xr(t,i,a){return i in t?Object.defineProperty(t,i,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[i]=a,t}new Ye;new Ye;function xm(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}var mi=function t(i,a,r){var o=this;xm(this,t),Xr(this,"dot2",function(c,u){return o.x*c+o.y*u}),Xr(this,"dot3",function(c,u,d){return o.x*c+o.y*u+o.z*d}),this.x=i,this.y=a,this.z=r},Lx=[new mi(1,1,0),new mi(-1,1,0),new mi(1,-1,0),new mi(-1,-1,0),new mi(1,0,1),new mi(-1,0,1),new mi(1,0,-1),new mi(-1,0,-1),new mi(0,1,1),new mi(0,-1,1),new mi(0,1,-1),new mi(0,-1,-1)],Uh=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],Ch=new Array(512),Dh=new Array(512),Bx=function(i){i>0&&i<1&&(i*=65536),i=Math.floor(i),i<256&&(i|=i<<8);for(var a=0;a<256;a++){var r;a&1?r=Uh[a]^i&255:r=Uh[a]^i>>8&255,Ch[a]=Ch[a+256]=r,Dh[a]=Dh[a+256]=Lx[r%12]}};Bx(0);function Ox(t){if(typeof t=="number")t=Math.abs(t);else if(typeof t=="string"){var i=t;t=0;for(var a=0;a<i.length;a++)t=(t+(a+1)*(i.charCodeAt(a)%96))%2147483647}return t===0&&(t=311),t}function wh(t){var i=Ox(t);return function(){var a=i*48271%2147483647;return i=a,a/2147483647}}var Ix=function t(i){var a=this;xm(this,t),Xr(this,"seed",0),Xr(this,"init",function(r){a.seed=r,a.value=wh(r)}),Xr(this,"value",wh(this.seed)),this.init(i)};new Ix(Math.random());const Fx=St.createContext(null),Ph=t=>(t.getAttributes()&2)===2,Hx=St.memo(St.forwardRef(({children:t,camera:i,scene:a,resolutionScale:r,enabled:o=!0,renderPriority:c=1,autoClear:u=!0,depthBuffer:d,enableNormalPass:p,stencilBuffer:g,multisampling:E=8,frameBufferType:_=Kr},v)=>{const{gl:S,scene:U,camera:w,size:T}=Qu(),m=a||U,x=i||w,[R,b,P]=St.useMemo(()=>{const I=new _y(S,{depthBuffer:d,stencilBuffer:g,multisampling:E,frameBufferType:_});I.addPass(new ju(m,x));let y=null,M=null;return p&&(M=new Nx(m,x),M.enabled=!1,I.addPass(M),r!==void 0&&(y=new Ax({normalBuffer:M.texture,resolutionScale:r}),y.enabled=!1,I.addPass(y))),[I,M,y]},[x,S,d,g,E,_,m,p,r]);St.useEffect(()=>R==null?void 0:R.setSize(T.width,T.height),[R,T]),oy((I,y)=>{if(o){const M=S.autoClear;S.autoClear=u,g&&!u&&S.clearStencil(),R.render(y),S.autoClear=M}},o?c:0);const N=St.useRef(null);St.useLayoutEffect(()=>{var M;const I=[],y=N.current.__r3f;if(y&&R){const L=y.children;for(let F=0;F<L.length;F++){const W=L[F].object;if(W instanceof Zs){const Q=[W];if(!Ph(W)){let G=null;for(;(G=(M=L[F+1])==null?void 0:M.object)instanceof Zs&&!Ph(G);)Q.push(G),F++}const te=new Px(x,...Q);I.push(te)}else W instanceof Wn&&I.push(W)}for(const F of I)R==null||R.addPass(F);b&&(b.enabled=!0),P&&(P.enabled=!0)}return()=>{for(const L of I)R==null||R.removePass(L);b&&(b.enabled=!1),P&&(P.enabled=!1)}},[R,t,x,b,P]),St.useEffect(()=>{const I=S.toneMapping;return S.toneMapping=sa,()=>{S.toneMapping=I}},[S]);const O=St.useMemo(()=>({composer:R,normalPass:b,downSamplingPass:P,resolutionScale:r,camera:x,scene:m}),[R,b,P,r,x,m]);return St.useImperativeHandle(v,()=>R,[R]),ks.jsx(Fx.Provider,{value:O,children:ks.jsx("group",{ref:N,children:t})})}));let zx=0;const Nh=new WeakMap,Ju=(t,i)=>function({blendFunction:a=i==null?void 0:i.blendFunction,opacity:r=i==null?void 0:i.opacity,...o}){let c=Nh.get(t);if(!c){const p=`@react-three/postprocessing/${t.name}-${zx++}`;uy({[p]:t}),Nh.set(t,c=p)}const u=Qu(p=>p.camera),d=Yh.useMemo(()=>[...(i==null?void 0:i.args)??[],...o.args??[{...i,...o}]],[JSON.stringify(o)]);return ks.jsx(c,{camera:u,"blendMode-blendFunction":a,"blendMode-opacity-value":r,...o,args:d})},Ho=(t,i)=>{const a=t[i];return Yh.useMemo(()=>typeof a=="number"?new Ye(a,a):a?new Ye(...a):new Ye,[a])},Gx=Ju(mx,{blendFunction:0}),Vx=Ju(_x),Xx=St.forwardRef(function({active:t=!0,...i},a){const r=Qu(g=>g.invalidate),o=Ho(i,"delay"),c=Ho(i,"duration"),u=Ho(i,"strength"),d=Ho(i,"chromaticAberrationOffset"),p=St.useMemo(()=>new Tx({...i,delay:o,duration:c,strength:u,chromaticAberrationOffset:d}),[o,c,i,u,d]);return St.useLayoutEffect(()=>{p.mode=t?i.mode||Ua.SPORADIC:Ua.DISABLED,r()},[t,p,r,i.mode]),St.useEffect(()=>()=>{var g;(g=p.dispose)==null||g.call(p)},[p]),ks.jsx("primitive",{ref:a,object:p,dispose:null})}),Wx=Ju(bx);class qx{constructor(i,a,r){ie(this,"composer");ie(this,"bloom");ie(this,"chromaticAberration");ie(this,"glitch");ie(this,"smoothedAudio",{bass:0,mid:0,treble:0,energy:0});this.composer=new Hx(i),this.composer.addPass(new ju(a,r)),this.bloom=new Gx({intensity:.5,luminanceThreshold:.9,luminanceSmoothing:.9,mipmapBlur:!0}),this.chromaticAberration=new Vx({blendFunction:ht.NORMAL,offset:new Ye(.001,.001)}),this.glitch=new Xx({delay:new Ye(.5,1),duration:new Ye(.1,.3),strength:new Ye(0,0),mode:Ua.SPORADIC});const o=new Wx({offset:.3,darkness:.6,blendFunction:ht.NORMAL});this.composer.addPass(this.bloom),this.composer.addPass(this.chromaticAberration),this.composer.addPass(this.glitch),this.composer.addPass(o)}update(i,a=1){this.smoothedAudio.bass+=(i.bass-this.smoothedAudio.bass)*.15,this.smoothedAudio.mid+=(i.mid-this.smoothedAudio.mid)*.15,this.smoothedAudio.treble+=(i.treble-this.smoothedAudio.treble)*.15,this.smoothedAudio.energy+=(i.energy-this.smoothedAudio.energy)*.15,this.bloom.intensity=Xt.lerp(.5,3,this.smoothedAudio.bass*a),this.bloom.luminanceThreshold=Xt.lerp(.9,.3,this.smoothedAudio.energy);const o=this.smoothedAudio.treble*.003*a;if(this.chromaticAberration.offset.set(o,o),this.smoothedAudio.energy>.85){const c=Xt.lerp(.1,.6,(this.smoothedAudio.energy-.85)/.15);this.glitch.strength.set(c,c)}else this.glitch.strength.set(0,0)}render(i){this.composer.render(i)}setSize(i,a){this.composer.setSize(i,a)}}class kx{constructor(i){ie(this,"scene");ie(this,"camera");ie(this,"renderer");ie(this,"postProcessing");ie(this,"container");ie(this,"skyboxTexture");ie(this,"handleResize",()=>{var c;const i=this.container.clientWidth||(typeof window<"u"?window.innerWidth:1),a=this.container.clientHeight||(typeof window<"u"?window.innerHeight:1);this.camera.aspect=i/a,this.camera.updateProjectionMatrix();const r=typeof window<"u"&&window.devicePixelRatio?window.devicePixelRatio:1,o=Math.min(r,ft.MAX_DPR);this.renderer.setPixelRatio(o),this.renderer.setSize(i,a),(c=this.postProcessing)==null||c.setSize(i,a)});ie(this,"handleContextLost",i=>{i.preventDefault(),window.dispatchEvent(new CustomEvent("audiorailrider:webglcontextlost"))});ie(this,"handleContextRestored",()=>{window.dispatchEvent(new CustomEvent("audiorailrider:webglcontextrestored"))});this.container=i,this.scene=new fl;const a=this.container.clientWidth||(typeof window<"u"?window.innerWidth:1),r=this.container.clientHeight||(typeof window<"u"?window.innerHeight:1);this.camera=new Ws(ft.CAMERA_BASE_FOV,a/r,ft.CAMERA_NEAR,ft.CAMERA_FAR),this.renderer=new jM({antialias:!0,alpha:!0}),this.scene.userData=this.scene.userData||{},this.scene.userData._fpsMeter=new $M(ft.FPS_METER_INTERVAL),this.init()}init(){const i=this.container.clientWidth||(typeof window<"u"?window.innerWidth:1),a=this.container.clientHeight||(typeof window<"u"?window.innerHeight:1),r=typeof window<"u"&&window.devicePixelRatio?window.devicePixelRatio:1,o=Math.min(r,ft.MAX_DPR);this.renderer.setPixelRatio(o),this.renderer.setSize(i,a),this.renderer.domElement.style.display="block",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.container.appendChild(this.renderer.domElement),this.postProcessing=new qx(this.renderer,this.scene,this.camera);const c=new at(kc.DEFAULT_BACKGROUND_TOP_COLOR);new at(kc.DEFAULT_BACKGROUND_BOTTOM_COLOR),this.scene.background=c,this.scene.fog=new j_(kc.DEFAULT_FOG_COLOR,ft.FOG_NEAR,ft.FOG_FAR);const u=new J_(16777215,ft.AMBIENT_LIGHT_INTENSITY);this.scene.add(u);const d=new kp(16777215,ft.DIRECTIONAL_LIGHT_INTENSITY);d.position.set(10,50,10),this.scene.add(d);const p=new kp(6711039,ft.BACKLIGHT_INTENSITY);p.position.set(-10,20,-10),this.scene.add(p),typeof window<"u"&&(window.addEventListener("resize",this.handleResize),this.renderer.domElement.addEventListener("webglcontextlost",this.handleContextLost,!1),this.renderer.domElement.addEventListener("webglcontextrestored",this.handleContextRestored,!1))}updateSkybox(i){this.skyboxTexture&&this.skyboxTexture.dispose(),new $_().load(i,r=>{r.mapping=ul,this.scene.background=r,this.scene.environment=r,this.skyboxTexture=r},void 0,r=>{console.error("An error occurred while loading the skybox texture:",r),this.scene.background=new at(0)})}render(i){var a,r;try{const o=(a=this.scene.userData)==null?void 0:a._fpsMeter;if(o){const c=o.tick();c!==null&&(this.scene.userData.lodHint=c<40?"low":"high",c<30?this.renderer.setPixelRatio(1):this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,ft.MAX_DPR)))}}catch{}(r=this.postProcessing)==null||r.render(i)}updatePostProcessing(i){var a;(a=this.postProcessing)==null||a.update(i)}dispose(){typeof window<"u"&&(window.removeEventListener("resize",this.handleResize),this.renderer.domElement.removeEventListener("webglcontextlost",this.handleContextLost,!1),this.renderer.domElement.removeEventListener("webglcontextrestored",this.handleContextRestored,!1)),this.skyboxTexture&&this.skyboxTexture.dispose(),this.renderer.domElement.parentElement===this.container&&this.container.removeChild(this.renderer.domElement),this.renderer.dispose(),this.scene.clear()}}const Yx=t=>{const i=St.useRef(null);return St.useEffect(()=>{if(!t.current)return;const a=t.current;return i.current=new kx(a),()=>{var r;(r=i.current)==null||r.dispose(),i.current=null}},[t]),i},Kx=(t,i)=>{const a=ia(r=>r.actions.setTrackData);St.useEffect(()=>{if(!t||!i)return;console.log("[useTrackComposer] Blueprint and audio features are available. Composing track...");const o=new eS().compose(t,i);a(o),console.log("[useTrackComposer] Track data composed and set in store.")},[t,i,a])},aa=class aa{constructor(i,a){ie(this,"camera");ie(this,"curve");ie(this,"trackData");ie(this,"_pos",new le);ie(this,"_lookAtPos",new le);ie(this,"_upTmp",new le);ie(this,"_sideTmp",new le);ie(this,"_offsetTmp",new le);ie(this,"_lookAtOffsetTmp",new le);ie(this,"_cameraPosTmp",new le);ie(this,"_lookTargetTmp",new le);ie(this,"_lastSide",new le(1,0,0));ie(this,"_blendedUp",new le(0,1,0));ie(this,"_smoothedUp",new le(0,1,0));ie(this,"_trackRadius",.35);this.camera=i,this.trackData=a,a.path&&a.path.length>1?this.curve=new bu(a.path,!1,"catmullrom",.5):this.curve=new bu([new le(0,0,0),new le(0,0,-1)])}get lookAtPos(){return this._lookAtPos}setTrackRadius(i){typeof i=="number"&&isFinite(i)&&i>0&&(this._trackRadius=i)}update(i){const a=Xt.clamp(i,0,1);this.curve.getPointAt(a,this._pos);const o=Math.min(.025,1-a);if(o>0)this.curve.getPointAt(a+o,this._lookAtPos);else{const v=this.curve.getTangentAt(a);this._lookAtPos.copy(this._pos).addScaledVector(v,1)}const c=this.curve.getTangentAt(a).normalize(),u=this.trackData.upVectors;if(u.length>=2){const v=a*(u.length-1),S=Math.floor(v),U=Math.min(S+1,u.length-1),w=v-S;this._upTmp.copy(u[S]).lerp(u[U],w)}else u.length===1?this._upTmp.copy(u[0]):this._upTmp.copy(aa.WORLD_UP);this._upTmp.normalize(),this._blendedUp.copy(this._upTmp).lerp(aa.WORLD_UP,.6).normalize(),this._smoothedUp.lerp(this._blendedUp,.2).normalize(),this.camera.up.copy(this._smoothedUp),this._sideTmp.crossVectors(c,aa.WORLD_UP),this._sideTmp.lengthSq()<1e-6&&this._sideTmp.crossVectors(c,this._smoothedUp),this._sideTmp.lengthSq()<1e-6?this._sideTmp.copy(this._lastSide):(this._sideTmp.normalize(),this._lastSide.lerp(this._sideTmp,.3).normalize(),this._sideTmp.copy(this._lastSide)),Xt.clamp(1-Math.abs(this._smoothedUp.dot(aa.WORLD_UP)),0,1);const p=this._trackRadius+.18,g=.12;this._offsetTmp.set(0,0,0).addScaledVector(this._sideTmp,p).addScaledVector(aa.WORLD_UP,g),this._cameraPosTmp.copy(this._pos).add(this._offsetTmp),this.camera.position.copy(this._cameraPosTmp),this._lookAtOffsetTmp.set(0,0,0).addScaledVector(aa.WORLD_UP,g*.55).addScaledVector(this._sideTmp,p*.28),this._lookTargetTmp.copy(this._lookAtPos).add(this._lookAtOffsetTmp),this.camera.lookAt(this._lookTargetTmp);const E=o>0?this._lookAtPos.distanceTo(this._pos)/o:0,_=Xt.clamp(E*1.35,0,160);this.camera.fov=ft.CAMERA_BASE_FOV+Math.min(ft.CAMERA_MAX_FOV_BOOST,_*ft.CAMERA_SPEED_FOV_FACTOR),this.camera.updateProjectionMatrix()}};ie(aa,"WORLD_UP",new le(0,1,0));let Du=aa;class Qx{constructor(){ie(this,"pool",[]);ie(this,"activeGeometries",new Set)}acquire(){const i=this.pool.pop()||new as;return this.activeGeometries.add(i),i}release(i){if(this.activeGeometries.has(i))try{if(typeof i.clear=="function")i.clear();else{const a=i;if(a.attributes&&typeof a.attributes=="object")for(const r of Object.keys(a.attributes))if(typeof i.deleteAttribute=="function")i.deleteAttribute(r);else try{delete a.attributes[r]}catch{}try{i.setIndex(null)}catch{}if(a.morphAttributes&&typeof a.morphAttributes=="object")for(const r of Object.keys(a.morphAttributes))try{delete a.morphAttributes[r]}catch{}try{a.boundsTree&&delete a.boundsTree}catch{}try{i.boundingBox=null,i.boundingSphere=null}catch{}try{i.groups=[]}catch{}}this.activeGeometries.delete(i),this.pool.push(i)}catch{try{i.dispose()}catch{}this.activeGeometries.delete(i),this.pool.push(new as)}}dispose(){this.pool.forEach(i=>i.dispose()),this.activeGeometries.forEach(i=>i.dispose()),this.pool=[],this.activeGeometries.clear()}}const ru=new Qx,Am=0,Zx=1,jx=2,Lh=2,ou=1.25,Bh=1,Wr=32,vl=65535,Jx=Math.pow(2,-24),lu=Symbol("SKIP_GENERATION");function $x(t){return t.index?t.index.count:t.attributes.position.count}function er(t){return $x(t)/3}function eA(t,i=ArrayBuffer){return t>65535?new Uint32Array(new i(4*t)):new Uint16Array(new i(2*t))}function tA(t,i){if(!t.index){const a=t.attributes.position.count,r=i.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,o=eA(a,r);t.setIndex(new ii(o,1));for(let c=0;c<a;c++)o[c]=c}}function Rm(t,i){const a=er(t),r=i||t.drawRange,o=r.start/3,c=(r.start+r.count)/3,u=Math.max(0,o),d=Math.min(a,c)-u;return[{offset:Math.floor(u),count:Math.floor(d)}]}function bm(t,i){if(!t.groups||!t.groups.length)return Rm(t,i);const a=[],r=new Set,o=i||t.drawRange,c=o.start/3,u=(o.start+o.count)/3;for(const p of t.groups){const g=p.start/3,E=(p.start+p.count)/3;r.add(Math.max(c,g)),r.add(Math.min(u,E))}const d=Array.from(r.values()).sort((p,g)=>p-g);for(let p=0;p<d.length-1;p++){const g=d[p],E=d[p+1];a.push({offset:Math.floor(g),count:Math.floor(E-g)})}return a}function nA(t,i){const a=er(t),r=bm(t,i).sort((u,d)=>u.offset-d.offset),o=r[r.length-1];o.count=Math.min(a-o.offset,o.count);let c=0;return r.forEach(({count:u})=>c+=u),a!==c}function cu(t,i,a,r,o){let c=1/0,u=1/0,d=1/0,p=-1/0,g=-1/0,E=-1/0,_=1/0,v=1/0,S=1/0,U=-1/0,w=-1/0,T=-1/0;for(let m=i*6,x=(i+a)*6;m<x;m+=6){const R=t[m+0],b=t[m+1],P=R-b,N=R+b;P<c&&(c=P),N>p&&(p=N),R<_&&(_=R),R>U&&(U=R);const O=t[m+2],I=t[m+3],y=O-I,M=O+I;y<u&&(u=y),M>g&&(g=M),O<v&&(v=O),O>w&&(w=O);const L=t[m+4],F=t[m+5],W=L-F,Q=L+F;W<d&&(d=W),Q>E&&(E=Q),L<S&&(S=L),L>T&&(T=L)}r[0]=c,r[1]=u,r[2]=d,r[3]=p,r[4]=g,r[5]=E,o[0]=_,o[1]=v,o[2]=S,o[3]=U,o[4]=w,o[5]=T}function iA(t,i=null,a=null,r=null){const o=t.attributes.position,c=t.index?t.index.array:null,u=er(t),d=o.normalized;let p;i===null?(p=new Float32Array(u*6*4),a=0,r=u):(p=i,a=a||0,r=r||u);const g=o.array,E=o.offset||0;let _=3;o.isInterleavedBufferAttribute&&(_=o.data.stride);const v=["getX","getY","getZ"];for(let S=a;S<a+r;S++){const U=S*3,w=S*6;let T=U+0,m=U+1,x=U+2;c&&(T=c[T],m=c[m],x=c[x]),d||(T=T*_+E,m=m*_+E,x=x*_+E);for(let R=0;R<3;R++){let b,P,N;d?(b=o[v[R]](T),P=o[v[R]](m),N=o[v[R]](x)):(b=g[T+R],P=g[m+R],N=g[x+R]);let O=b;P<O&&(O=P),N<O&&(O=N);let I=b;P>I&&(I=P),N>I&&(I=N);const y=(I-O)/2,M=R*2;p[w+M+0]=O+y,p[w+M+1]=y+(Math.abs(O)+y)*Jx}}return p}function Jt(t,i,a){return a.min.x=i[t],a.min.y=i[t+1],a.min.z=i[t+2],a.max.x=i[t+3],a.max.y=i[t+4],a.max.z=i[t+5],a}function Oh(t){let i=-1,a=-1/0;for(let r=0;r<3;r++){const o=t[r+3]-t[r];o>a&&(a=o,i=r)}return i}function Ih(t,i){i.set(t)}function Fh(t,i,a){let r,o;for(let c=0;c<3;c++){const u=c+3;r=t[c],o=i[c],a[c]=r<o?r:o,r=t[u],o=i[u],a[u]=r>o?r:o}}function zo(t,i,a){for(let r=0;r<3;r++){const o=i[t+2*r],c=i[t+2*r+1],u=o-c,d=o+c;u<a[r]&&(a[r]=u),d>a[r+3]&&(a[r+3]=d)}}function Pr(t){const i=t[3]-t[0],a=t[4]-t[1],r=t[5]-t[2];return 2*(i*a+a*r+r*i)}const na=32,aA=(t,i)=>t.candidate-i.candidate,Aa=new Array(na).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),Go=new Float32Array(6);function sA(t,i,a,r,o,c){let u=-1,d=0;if(c===Am)u=Oh(i),u!==-1&&(d=(i[u]+i[u+3])/2);else if(c===Zx)u=Oh(t),u!==-1&&(d=rA(a,r,o,u));else if(c===jx){const p=Pr(t);let g=ou*o;const E=r*6,_=(r+o)*6;for(let v=0;v<3;v++){const S=i[v],T=(i[v+3]-S)/na;if(o<na/4){const m=[...Aa];m.length=o;let x=0;for(let b=E;b<_;b+=6,x++){const P=m[x];P.candidate=a[b+2*v],P.count=0;const{bounds:N,leftCacheBounds:O,rightCacheBounds:I}=P;for(let y=0;y<3;y++)I[y]=1/0,I[y+3]=-1/0,O[y]=1/0,O[y+3]=-1/0,N[y]=1/0,N[y+3]=-1/0;zo(b,a,N)}m.sort(aA);let R=o;for(let b=0;b<R;b++){const P=m[b];for(;b+1<R&&m[b+1].candidate===P.candidate;)m.splice(b+1,1),R--}for(let b=E;b<_;b+=6){const P=a[b+2*v];for(let N=0;N<R;N++){const O=m[N];P>=O.candidate?zo(b,a,O.rightCacheBounds):(zo(b,a,O.leftCacheBounds),O.count++)}}for(let b=0;b<R;b++){const P=m[b],N=P.count,O=o-P.count,I=P.leftCacheBounds,y=P.rightCacheBounds;let M=0;N!==0&&(M=Pr(I)/p);let L=0;O!==0&&(L=Pr(y)/p);const F=Bh+ou*(M*N+L*O);F<g&&(u=v,g=F,d=P.candidate)}}else{for(let R=0;R<na;R++){const b=Aa[R];b.count=0,b.candidate=S+T+R*T;const P=b.bounds;for(let N=0;N<3;N++)P[N]=1/0,P[N+3]=-1/0}for(let R=E;R<_;R+=6){let N=~~((a[R+2*v]-S)/T);N>=na&&(N=na-1);const O=Aa[N];O.count++,zo(R,a,O.bounds)}const m=Aa[na-1];Ih(m.bounds,m.rightCacheBounds);for(let R=na-2;R>=0;R--){const b=Aa[R],P=Aa[R+1];Fh(b.bounds,P.rightCacheBounds,b.rightCacheBounds)}let x=0;for(let R=0;R<na-1;R++){const b=Aa[R],P=b.count,N=b.bounds,I=Aa[R+1].rightCacheBounds;P!==0&&(x===0?Ih(N,Go):Fh(N,Go,Go)),x+=P;let y=0,M=0;x!==0&&(y=Pr(Go)/p);const L=o-x;L!==0&&(M=Pr(I)/p);const F=Bh+ou*(y*x+M*L);F<g&&(u=v,g=F,d=b.candidate)}}}}else console.warn(`MeshBVH: Invalid build strategy value ${c} used.`);return{axis:u,pos:d}}function rA(t,i,a,r){let o=0;for(let c=i,u=i+a;c<u;c++)o+=t[c*6+r*2];return o/a}class uu{constructor(){this.boundingData=new Float32Array(6)}}function oA(t,i,a,r,o,c){let u=r,d=r+o-1;const p=c.pos,g=c.axis*2;for(;;){for(;u<=d&&a[u*6+g]<p;)u++;for(;u<=d&&a[d*6+g]>=p;)d--;if(u<d){for(let E=0;E<3;E++){let _=i[u*3+E];i[u*3+E]=i[d*3+E],i[d*3+E]=_}for(let E=0;E<6;E++){let _=a[u*6+E];a[u*6+E]=a[d*6+E],a[d*6+E]=_}u++,d--}else return u}}function lA(t,i,a,r,o,c){let u=r,d=r+o-1;const p=c.pos,g=c.axis*2;for(;;){for(;u<=d&&a[u*6+g]<p;)u++;for(;u<=d&&a[d*6+g]>=p;)d--;if(u<d){let E=t[u];t[u]=t[d],t[d]=E;for(let _=0;_<6;_++){let v=a[u*6+_];a[u*6+_]=a[d*6+_],a[d*6+_]=v}u++,d--}else return u}}function Vn(t,i){return i[t+15]===65535}function ai(t,i){return i[t+6]}function Si(t,i){return i[t+14]}function Ei(t){return t+8}function Ti(t,i){return i[t+6]}function Um(t,i){return i[t+7]}let Cm,Vr,al,Dm;const cA=Math.pow(2,32);function wu(t){return"count"in t?1:1+wu(t.left)+wu(t.right)}function uA(t,i,a){return Cm=new Float32Array(a),Vr=new Uint32Array(a),al=new Uint16Array(a),Dm=new Uint8Array(a),Pu(t,i)}function Pu(t,i){const a=t/4,r=t/2,o="count"in i,c=i.boundingData;for(let u=0;u<6;u++)Cm[a+u]=c[u];if(o)if(i.buffer){const u=i.buffer;Dm.set(new Uint8Array(u),t);for(let d=t,p=t+u.byteLength;d<p;d+=Wr){const g=d/2;Vn(g,al)||(Vr[d/4+6]+=a)}return t+u.byteLength}else{const u=i.offset,d=i.count;return Vr[a+6]=u,al[r+14]=d,al[r+15]=vl,t+Wr}else{const u=i.left,d=i.right,p=i.splitAxis;let g;if(g=Pu(t+Wr,u),g/4>cA)throw new Error("MeshBVH: Cannot store child pointer greater than 32 bits.");return Vr[a+6]=g/4,g=Pu(g,d),Vr[a+7]=p,g}}function fA(t,i){const a=(t.index?t.index.count:t.attributes.position.count)/3,r=a>2**16,o=r?4:2,c=i?new SharedArrayBuffer(a*o):new ArrayBuffer(a*o),u=r?new Uint32Array(c):new Uint16Array(c);for(let d=0,p=u.length;d<p;d++)u[d]=d;return u}function dA(t,i,a,r,o){const{maxDepth:c,verbose:u,maxLeafTris:d,strategy:p,onProgress:g,indirect:E}=o,_=t._indirectBuffer,v=t.geometry,S=v.index?v.index.array:null,U=E?lA:oA,w=er(v),T=new Float32Array(6);let m=!1;const x=new uu;return cu(i,a,r,x.boundingData,T),b(x,a,r,T),x;function R(P){g&&g(P/w)}function b(P,N,O,I=null,y=0){if(!m&&y>=c&&(m=!0,u&&(console.warn(`MeshBVH: Max depth of ${c} reached when generating BVH. Consider increasing maxDepth.`),console.warn(v))),O<=d||y>=c)return R(N+O),P.offset=N,P.count=O,P;const M=sA(P.boundingData,I,i,N,O,p);if(M.axis===-1)return R(N+O),P.offset=N,P.count=O,P;const L=U(_,S,i,N,O,M);if(L===N||L===N+O)R(N+O),P.offset=N,P.count=O;else{P.splitAxis=M.axis;const F=new uu,W=N,Q=L-N;P.left=F,cu(i,W,Q,F.boundingData,T),b(F,W,Q,T,y+1);const te=new uu,G=L,ne=O-Q;P.right=te,cu(i,G,ne,te.boundingData,T),b(te,G,ne,T,y+1)}return P}}function pA(t,i){const a=t.geometry;i.indirect&&(t._indirectBuffer=fA(a,i.useSharedArrayBuffer),nA(a,i.range)&&!i.verbose&&console.warn('MeshBVH: Provided geometry contains groups or a range that do not fully span the vertex contents while using the "indirect" option. BVH may incorrectly report intersections on unrendered portions of the geometry.')),t._indirectBuffer||tA(a,i);const r=i.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,o=iA(a),c=i.indirect?Rm(a,i.range):bm(a,i.range);t._roots=c.map(u=>{const d=dA(t,o,u.offset,u.count,i),p=wu(d),g=new r(Wr*p);return uA(0,d,g),g})}class oa{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(i,a){let r=1/0,o=-1/0;for(let c=0,u=i.length;c<u;c++){const p=i[c][a];r=p<r?p:r,o=p>o?p:o}this.min=r,this.max=o}setFromPoints(i,a){let r=1/0,o=-1/0;for(let c=0,u=a.length;c<u;c++){const d=a[c],p=i.dot(d);r=p<r?p:r,o=p>o?p:o}this.min=r,this.max=o}isSeparated(i){return this.min>i.max||i.min>this.max}}oa.prototype.setFromBox=(function(){const t=new le;return function(a,r){const o=r.min,c=r.max;let u=1/0,d=-1/0;for(let p=0;p<=1;p++)for(let g=0;g<=1;g++)for(let E=0;E<=1;E++){t.x=o.x*p+c.x*(1-p),t.y=o.y*g+c.y*(1-g),t.z=o.z*E+c.z*(1-E);const _=a.dot(t);u=Math.min(_,u),d=Math.max(_,d)}this.min=u,this.max=d}})();const hA=(function(){const t=new le,i=new le,a=new le;return function(o,c,u){const d=o.start,p=t,g=c.start,E=i;a.subVectors(d,g),t.subVectors(o.end,o.start),i.subVectors(c.end,c.start);const _=a.dot(E),v=E.dot(p),S=E.dot(E),U=a.dot(p),T=p.dot(p)*S-v*v;let m,x;T!==0?m=(_*v-U*S)/T:m=0,x=(_+m*v)/S,u.x=m,u.y=x}})(),$u=(function(){const t=new Ye,i=new le,a=new le;return function(o,c,u,d){hA(o,c,t);let p=t.x,g=t.y;if(p>=0&&p<=1&&g>=0&&g<=1){o.at(p,u),c.at(g,d);return}else if(p>=0&&p<=1){g<0?c.at(0,d):c.at(1,d),o.closestPointToPoint(d,!0,u);return}else if(g>=0&&g<=1){p<0?o.at(0,u):o.at(1,u),c.closestPointToPoint(u,!0,d);return}else{let E;p<0?E=o.start:E=o.end;let _;g<0?_=c.start:_=c.end;const v=i,S=a;if(o.closestPointToPoint(_,!0,i),c.closestPointToPoint(E,!0,a),v.distanceToSquared(_)<=S.distanceToSquared(E)){u.copy(v),d.copy(_);return}else{u.copy(E),d.copy(S);return}}}})(),mA=(function(){const t=new le,i=new le,a=new Wu,r=new ra;return function(c,u){const{radius:d,center:p}=c,{a:g,b:E,c:_}=u;if(r.start=g,r.end=E,r.closestPointToPoint(p,!0,t).distanceTo(p)<=d||(r.start=g,r.end=_,r.closestPointToPoint(p,!0,t).distanceTo(p)<=d)||(r.start=E,r.end=_,r.closestPointToPoint(p,!0,t).distanceTo(p)<=d))return!0;const w=u.getPlane(a);if(Math.abs(w.distanceToPoint(p))<=d){const m=w.projectPoint(p,i);if(u.containsPoint(m))return!0}return!1}})(),vA=1e-15;function fu(t){return Math.abs(t)<vA}class wi extends Hr{constructor(...i){super(...i),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new le),this.satBounds=new Array(4).fill().map(()=>new oa),this.points=[this.a,this.b,this.c],this.sphere=new tS,this.plane=new Wu,this.needsUpdate=!0}intersectsSphere(i){return mA(i,this)}update(){const i=this.a,a=this.b,r=this.c,o=this.points,c=this.satAxes,u=this.satBounds,d=c[0],p=u[0];this.getNormal(d),p.setFromPoints(d,o);const g=c[1],E=u[1];g.subVectors(i,a),E.setFromPoints(g,o);const _=c[2],v=u[2];_.subVectors(a,r),v.setFromPoints(_,o);const S=c[3],U=u[3];S.subVectors(r,i),U.setFromPoints(S,o),this.sphere.setFromPoints(this.points),this.plane.setFromNormalAndCoplanarPoint(d,i),this.needsUpdate=!1}}wi.prototype.closestPointToSegment=(function(){const t=new le,i=new le,a=new ra;return function(o,c=null,u=null){const{start:d,end:p}=o,g=this.points;let E,_=1/0;for(let v=0;v<3;v++){const S=(v+1)%3;a.start.copy(g[v]),a.end.copy(g[S]),$u(a,o,t,i),E=t.distanceToSquared(i),E<_&&(_=E,c&&c.copy(t),u&&u.copy(i))}return this.closestPointToPoint(d,t),E=d.distanceToSquared(t),E<_&&(_=E,c&&c.copy(t),u&&u.copy(d)),this.closestPointToPoint(p,t),E=p.distanceToSquared(t),E<_&&(_=E,c&&c.copy(t),u&&u.copy(p)),Math.sqrt(_)}})();wi.prototype.intersectsTriangle=(function(){const t=new wi,i=new Array(3),a=new Array(3),r=new oa,o=new oa,c=new le,u=new le,d=new le,p=new le,g=new le,E=new ra,_=new ra,v=new ra,S=new le;function U(w,T,m){const x=w.points;let R=0,b=-1;for(let P=0;P<3;P++){const{start:N,end:O}=E;N.copy(x[P]),O.copy(x[(P+1)%3]),E.delta(u);const I=fu(T.distanceToPoint(N));if(fu(T.normal.dot(u))&&I){m.copy(E),R=2;break}const y=T.intersectLine(E,S);if(!y&&I&&S.copy(N),(y||I)&&!fu(S.distanceTo(O))){if(R<=1)(R===1?m.start:m.end).copy(S),I&&(b=R);else if(R>=2){(b===1?m.start:m.end).copy(S),R=2;break}if(R++,R===2&&b===-1)break}}return R}return function(T,m=null,x=!1){this.needsUpdate&&this.update(),T.isExtendedTriangle?T.needsUpdate&&T.update():(t.copy(T),t.update(),T=t);const R=this.plane,b=T.plane;if(Math.abs(R.normal.dot(b.normal))>1-1e-10){const P=this.satBounds,N=this.satAxes;a[0]=T.a,a[1]=T.b,a[2]=T.c;for(let y=0;y<4;y++){const M=P[y],L=N[y];if(r.setFromPoints(L,a),M.isSeparated(r))return!1}const O=T.satBounds,I=T.satAxes;i[0]=this.a,i[1]=this.b,i[2]=this.c;for(let y=0;y<4;y++){const M=O[y],L=I[y];if(r.setFromPoints(L,i),M.isSeparated(r))return!1}for(let y=0;y<4;y++){const M=N[y];for(let L=0;L<4;L++){const F=I[L];if(c.crossVectors(M,F),r.setFromPoints(c,i),o.setFromPoints(c,a),r.isSeparated(o))return!1}}return m&&(x||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),m.start.set(0,0,0),m.end.set(0,0,0)),!0}else{const P=U(this,b,_);if(P===1&&T.containsPoint(_.end))return m&&(m.start.copy(_.end),m.end.copy(_.end)),!0;if(P!==2)return!1;const N=U(T,R,v);if(N===1&&this.containsPoint(v.end))return m&&(m.start.copy(v.end),m.end.copy(v.end)),!0;if(N!==2)return!1;if(_.delta(d),v.delta(p),d.dot(p)<0){let W=v.start;v.start=v.end,v.end=W}const O=_.start.dot(d),I=_.end.dot(d),y=v.start.dot(d),M=v.end.dot(d),L=I<y,F=O<M;return O!==M&&y!==I&&L===F?!1:(m&&(g.subVectors(_.start,v.start),g.dot(d)>0?m.start.copy(_.start):m.start.copy(v.start),g.subVectors(_.end,v.end),g.dot(d)<0?m.end.copy(_.end):m.end.copy(v.end)),!0)}}})();wi.prototype.distanceToPoint=(function(){const t=new le;return function(a){return this.closestPointToPoint(a,t),a.distanceTo(t)}})();wi.prototype.distanceToTriangle=(function(){const t=new le,i=new le,a=["a","b","c"],r=new ra,o=new ra;return function(u,d=null,p=null){const g=d||p?r:null;if(this.intersectsTriangle(u,g))return(d||p)&&(d&&g.getCenter(d),p&&g.getCenter(p)),0;let E=1/0;for(let _=0;_<3;_++){let v;const S=a[_],U=u[S];this.closestPointToPoint(U,t),v=U.distanceToSquared(t),v<E&&(E=v,d&&d.copy(t),p&&p.copy(U));const w=this[S];u.closestPointToPoint(w,t),v=w.distanceToSquared(t),v<E&&(E=v,d&&d.copy(w),p&&p.copy(t))}for(let _=0;_<3;_++){const v=a[_],S=a[(_+1)%3];r.set(this[v],this[S]);for(let U=0;U<3;U++){const w=a[U],T=a[(U+1)%3];o.set(u[w],u[T]),$u(r,o,t,i);const m=t.distanceToSquared(i);m<E&&(E=m,d&&d.copy(t),p&&p.copy(i))}}return Math.sqrt(E)}})();class On{constructor(i,a,r){this.isOrientedBox=!0,this.min=new le,this.max=new le,this.matrix=new Bn,this.invMatrix=new Bn,this.points=new Array(8).fill().map(()=>new le),this.satAxes=new Array(3).fill().map(()=>new le),this.satBounds=new Array(3).fill().map(()=>new oa),this.alignedSatBounds=new Array(3).fill().map(()=>new oa),this.needsUpdate=!1,i&&this.min.copy(i),a&&this.max.copy(a),r&&this.matrix.copy(r)}set(i,a,r){this.min.copy(i),this.max.copy(a),this.matrix.copy(r),this.needsUpdate=!0}copy(i){this.min.copy(i.min),this.max.copy(i.max),this.matrix.copy(i.matrix),this.needsUpdate=!0}}On.prototype.update=(function(){return function(){const i=this.matrix,a=this.min,r=this.max,o=this.points;for(let g=0;g<=1;g++)for(let E=0;E<=1;E++)for(let _=0;_<=1;_++){const v=1*g|2*E|4*_,S=o[v];S.x=g?r.x:a.x,S.y=E?r.y:a.y,S.z=_?r.z:a.z,S.applyMatrix4(i)}const c=this.satBounds,u=this.satAxes,d=o[0];for(let g=0;g<3;g++){const E=u[g],_=c[g],v=1<<g,S=o[v];E.subVectors(d,S),_.setFromPoints(E,o)}const p=this.alignedSatBounds;p[0].setFromPointsField(o,"x"),p[1].setFromPointsField(o,"y"),p[2].setFromPointsField(o,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}})();On.prototype.intersectsBox=(function(){const t=new oa;return function(a){this.needsUpdate&&this.update();const r=a.min,o=a.max,c=this.satBounds,u=this.satAxes,d=this.alignedSatBounds;if(t.min=r.x,t.max=o.x,d[0].isSeparated(t)||(t.min=r.y,t.max=o.y,d[1].isSeparated(t))||(t.min=r.z,t.max=o.z,d[2].isSeparated(t)))return!1;for(let p=0;p<3;p++){const g=u[p],E=c[p];if(t.setFromBox(g,a),E.isSeparated(t))return!1}return!0}})();On.prototype.intersectsTriangle=(function(){const t=new wi,i=new Array(3),a=new oa,r=new oa,o=new le;return function(u){this.needsUpdate&&this.update(),u.isExtendedTriangle?u.needsUpdate&&u.update():(t.copy(u),t.update(),u=t);const d=this.satBounds,p=this.satAxes;i[0]=u.a,i[1]=u.b,i[2]=u.c;for(let v=0;v<3;v++){const S=d[v],U=p[v];if(a.setFromPoints(U,i),S.isSeparated(a))return!1}const g=u.satBounds,E=u.satAxes,_=this.points;for(let v=0;v<3;v++){const S=g[v],U=E[v];if(a.setFromPoints(U,_),S.isSeparated(a))return!1}for(let v=0;v<3;v++){const S=p[v];for(let U=0;U<4;U++){const w=E[U];if(o.crossVectors(S,w),a.setFromPoints(o,i),r.setFromPoints(o,_),a.isSeparated(r))return!1}}return!0}})();On.prototype.closestPointToPoint=(function(){return function(i,a){return this.needsUpdate&&this.update(),a.copy(i).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),a}})();On.prototype.distanceToPoint=(function(){const t=new le;return function(a){return this.closestPointToPoint(a,t),a.distanceTo(t)}})();On.prototype.distanceToBox=(function(){const t=["x","y","z"],i=new Array(12).fill().map(()=>new ra),a=new Array(12).fill().map(()=>new ra),r=new le,o=new le;return function(u,d=0,p=null,g=null){if(this.needsUpdate&&this.update(),this.intersectsBox(u))return(p||g)&&(u.getCenter(o),this.closestPointToPoint(o,r),u.closestPointToPoint(r,o),p&&p.copy(r),g&&g.copy(o)),0;const E=d*d,_=u.min,v=u.max,S=this.points;let U=1/0;for(let T=0;T<8;T++){const m=S[T];o.copy(m).clamp(_,v);const x=m.distanceToSquared(o);if(x<U&&(U=x,p&&p.copy(m),g&&g.copy(o),x<E))return Math.sqrt(x)}let w=0;for(let T=0;T<3;T++)for(let m=0;m<=1;m++)for(let x=0;x<=1;x++){const R=(T+1)%3,b=(T+2)%3,P=m<<R|x<<b,N=1<<T|m<<R|x<<b,O=S[P],I=S[N];i[w].set(O,I);const M=t[T],L=t[R],F=t[b],W=a[w],Q=W.start,te=W.end;Q[M]=_[M],Q[L]=m?_[L]:v[L],Q[F]=x?_[F]:v[L],te[M]=v[M],te[L]=m?_[L]:v[L],te[F]=x?_[F]:v[L],w++}for(let T=0;T<=1;T++)for(let m=0;m<=1;m++)for(let x=0;x<=1;x++){o.x=T?v.x:_.x,o.y=m?v.y:_.y,o.z=x?v.z:_.z,this.closestPointToPoint(o,r);const R=o.distanceToSquared(r);if(R<U&&(U=R,p&&p.copy(r),g&&g.copy(o),R<E))return Math.sqrt(R)}for(let T=0;T<12;T++){const m=i[T];for(let x=0;x<12;x++){const R=a[x];$u(m,R,r,o);const b=r.distanceToSquared(o);if(b<U&&(U=b,p&&p.copy(r),g&&g.copy(o),b<E))return Math.sqrt(b)}}return Math.sqrt(U)}})();class ef{constructor(i){this._getNewPrimitive=i,this._primitives=[]}getPrimitive(){const i=this._primitives;return i.length===0?this._getNewPrimitive():i.pop()}releasePrimitive(i){this._primitives.push(i)}}class gA extends ef{constructor(){super(()=>new wi)}}const Mi=new gA;class _A{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;const i=[];let a=null;this.setBuffer=r=>{a&&i.push(a),a=r,this.float32Array=new Float32Array(r),this.uint16Array=new Uint16Array(r),this.uint32Array=new Uint32Array(r)},this.clearBuffer=()=>{a=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,i.length!==0&&this.setBuffer(i.pop())}}}const Wt=new _A;let Da,Xs;const Ps=[],Vo=new ef(()=>new zi);function SA(t,i,a,r,o,c){Da=Vo.getPrimitive(),Xs=Vo.getPrimitive(),Ps.push(Da,Xs),Wt.setBuffer(t._roots[i]);const u=Nu(0,t.geometry,a,r,o,c);Wt.clearBuffer(),Vo.releasePrimitive(Da),Vo.releasePrimitive(Xs),Ps.pop(),Ps.pop();const d=Ps.length;return d>0&&(Xs=Ps[d-1],Da=Ps[d-2]),u}function Nu(t,i,a,r,o=null,c=0,u=0){const{float32Array:d,uint16Array:p,uint32Array:g}=Wt;let E=t*2;if(Vn(E,p)){const v=ai(t,g),S=Si(E,p);return Jt(t,d,Da),r(v,S,!1,u,c+t,Da)}else{let M=function(F){const{uint16Array:W,uint32Array:Q}=Wt;let te=F*2;for(;!Vn(te,W);)F=Ei(F),te=F*2;return ai(F,Q)},L=function(F){const{uint16Array:W,uint32Array:Q}=Wt;let te=F*2;for(;!Vn(te,W);)F=Ti(F,Q),te=F*2;return ai(F,Q)+Si(te,W)};const v=Ei(t),S=Ti(t,g);let U=v,w=S,T,m,x,R;if(o&&(x=Da,R=Xs,Jt(U,d,x),Jt(w,d,R),T=o(x),m=o(R),m<T)){U=S,w=v;const F=T;T=m,m=F,x=R}x||(x=Da,Jt(U,d,x));const b=Vn(U*2,p),P=a(x,b,T,u+1,c+U);let N;if(P===Lh){const F=M(U),Q=L(U)-F;N=r(F,Q,!0,u+1,c+U,x)}else N=P&&Nu(U,i,a,r,o,c,u+1);if(N)return!0;R=Xs,Jt(w,d,R);const O=Vn(w*2,p),I=a(R,O,m,u+1,c+w);let y;if(I===Lh){const F=M(w),Q=L(w)-F;y=r(F,Q,!0,u+1,c+w,R)}else y=I&&Nu(w,i,a,r,o,c,u+1);return!!y}}const Nr=new le,du=new le;function EA(t,i,a={},r=0,o=1/0){const c=r*r,u=o*o;let d=1/0,p=null;if(t.shapecast({boundsTraverseOrder:E=>(Nr.copy(i).clamp(E.min,E.max),Nr.distanceToSquared(i)),intersectsBounds:(E,_,v)=>v<d&&v<u,intersectsTriangle:(E,_)=>{E.closestPointToPoint(i,Nr);const v=i.distanceToSquared(Nr);return v<d&&(du.copy(Nr),d=v,p=_),v<c}}),d===1/0)return null;const g=Math.sqrt(d);return a.point?a.point.copy(du):a.point=du.clone(),a.distance=g,a.faceIndex=p,a}const Ns=new le,Ls=new le,Bs=new le,Xo=new Ye,Wo=new Ye,qo=new Ye,Hh=new le,zh=new le,Gh=new le,ko=new le;function TA(t,i,a,r,o,c,u,d){let p;if(c===gn?p=t.intersectTriangle(r,a,i,!0,o):p=t.intersectTriangle(i,a,r,c!==Rn,o),p===null)return null;const g=t.origin.distanceTo(o);return g<u||g>d?null:{distance:g,point:o.clone()}}function MA(t,i,a,r,o,c,u,d,p,g,E){Ns.fromBufferAttribute(i,c),Ls.fromBufferAttribute(i,u),Bs.fromBufferAttribute(i,d);const _=TA(t,Ns,Ls,Bs,ko,p,g,E);if(_){r&&(Xo.fromBufferAttribute(r,c),Wo.fromBufferAttribute(r,u),qo.fromBufferAttribute(r,d),_.uv=Hr.getInterpolation(ko,Ns,Ls,Bs,Xo,Wo,qo,new Ye)),o&&(Xo.fromBufferAttribute(o,c),Wo.fromBufferAttribute(o,u),qo.fromBufferAttribute(o,d),_.uv1=Hr.getInterpolation(ko,Ns,Ls,Bs,Xo,Wo,qo,new Ye)),a&&(Hh.fromBufferAttribute(a,c),zh.fromBufferAttribute(a,u),Gh.fromBufferAttribute(a,d),_.normal=Hr.getInterpolation(ko,Ns,Ls,Bs,Hh,zh,Gh,new le),_.normal.dot(t.direction)>0&&_.normal.multiplyScalar(-1));const v={a:c,b:u,c:d,normal:new le,materialIndex:0};Hr.getNormal(Ns,Ls,Bs,v.normal),_.face=v,_.faceIndex=c}return _}function gl(t,i,a,r,o,c,u){const d=r*3;let p=d+0,g=d+1,E=d+2;const _=t.index;t.index&&(p=_.getX(p),g=_.getX(g),E=_.getX(E));const{position:v,normal:S,uv:U,uv1:w}=t.attributes,T=MA(a,v,S,U,w,p,g,E,i,c,u);return T?(T.faceIndex=r,o&&o.push(T),T):null}function an(t,i,a,r){const o=t.a,c=t.b,u=t.c;let d=i,p=i+1,g=i+2;a&&(d=a.getX(d),p=a.getX(p),g=a.getX(g)),o.x=r.getX(d),o.y=r.getY(d),o.z=r.getZ(d),c.x=r.getX(p),c.y=r.getY(p),c.z=r.getZ(p),u.x=r.getX(g),u.y=r.getY(g),u.z=r.getZ(g)}function yA(t,i,a,r,o,c,u,d){const{geometry:p,_indirectBuffer:g}=t;for(let E=r,_=r+o;E<_;E++)gl(p,i,a,E,c,u,d)}function xA(t,i,a,r,o,c,u){const{geometry:d,_indirectBuffer:p}=t;let g=1/0,E=null;for(let _=r,v=r+o;_<v;_++){let S;S=gl(d,i,a,_,null,c,u),S&&S.distance<g&&(E=S,g=S.distance)}return E}function AA(t,i,a,r,o,c,u){const{geometry:d}=a,{index:p}=d,g=d.attributes.position;for(let E=t,_=i+t;E<_;E++){let v;if(v=E,an(u,v*3,p,g),u.needsUpdate=!0,r(u,v,o,c))return!0}return!1}function RA(t,i=null){i&&Array.isArray(i)&&(i=new Set(i));const a=t.geometry,r=a.index?a.index.array:null,o=a.attributes.position;let c,u,d,p,g=0;const E=t._roots;for(let v=0,S=E.length;v<S;v++)c=E[v],u=new Uint32Array(c),d=new Uint16Array(c),p=new Float32Array(c),_(0,g),g+=c.byteLength;function _(v,S,U=!1){const w=v*2;if(d[w+15]===vl){const m=u[v+6],x=d[w+14];let R=1/0,b=1/0,P=1/0,N=-1/0,O=-1/0,I=-1/0;for(let y=3*m,M=3*(m+x);y<M;y++){let L=r[y];const F=o.getX(L),W=o.getY(L),Q=o.getZ(L);F<R&&(R=F),F>N&&(N=F),W<b&&(b=W),W>O&&(O=W),Q<P&&(P=Q),Q>I&&(I=Q)}return p[v+0]!==R||p[v+1]!==b||p[v+2]!==P||p[v+3]!==N||p[v+4]!==O||p[v+5]!==I?(p[v+0]=R,p[v+1]=b,p[v+2]=P,p[v+3]=N,p[v+4]=O,p[v+5]=I,!0):!1}else{const m=v+8,x=u[v+6],R=m+S,b=x+S;let P=U,N=!1,O=!1;i?P||(N=i.has(R),O=i.has(b),P=!N&&!O):(N=!0,O=!0);const I=P||N,y=P||O;let M=!1;I&&(M=_(m,S,P));let L=!1;y&&(L=_(x,S,P));const F=M||L;if(F)for(let W=0;W<3;W++){const Q=m+W,te=x+W,G=p[Q],ne=p[Q+3],K=p[te],de=p[te+3];p[v+W]=G<K?G:K,p[v+W+3]=ne>de?ne:de}return F}}}function Na(t,i,a,r,o){let c,u,d,p,g,E;const _=1/a.direction.x,v=1/a.direction.y,S=1/a.direction.z,U=a.origin.x,w=a.origin.y,T=a.origin.z;let m=i[t],x=i[t+3],R=i[t+1],b=i[t+3+1],P=i[t+2],N=i[t+3+2];return _>=0?(c=(m-U)*_,u=(x-U)*_):(c=(x-U)*_,u=(m-U)*_),v>=0?(d=(R-w)*v,p=(b-w)*v):(d=(b-w)*v,p=(R-w)*v),c>p||d>u||((d>c||isNaN(c))&&(c=d),(p<u||isNaN(u))&&(u=p),S>=0?(g=(P-T)*S,E=(N-T)*S):(g=(N-T)*S,E=(P-T)*S),c>E||g>u)?!1:((g>c||c!==c)&&(c=g),(E<u||u!==u)&&(u=E),c<=o&&u>=r)}function bA(t,i,a,r,o,c,u,d){const{geometry:p,_indirectBuffer:g}=t;for(let E=r,_=r+o;E<_;E++){let v=g?g[E]:E;gl(p,i,a,v,c,u,d)}}function UA(t,i,a,r,o,c,u){const{geometry:d,_indirectBuffer:p}=t;let g=1/0,E=null;for(let _=r,v=r+o;_<v;_++){let S;S=gl(d,i,a,p?p[_]:_,null,c,u),S&&S.distance<g&&(E=S,g=S.distance)}return E}function CA(t,i,a,r,o,c,u){const{geometry:d}=a,{index:p}=d,g=d.attributes.position;for(let E=t,_=i+t;E<_;E++){let v;if(v=a.resolveTriangleIndex(E),an(u,v*3,p,g),u.needsUpdate=!0,r(u,v,o,c))return!0}return!1}function DA(t,i,a,r,o,c,u){Wt.setBuffer(t._roots[i]),Lu(0,t,a,r,o,c,u),Wt.clearBuffer()}function Lu(t,i,a,r,o,c,u){const{float32Array:d,uint16Array:p,uint32Array:g}=Wt,E=t*2;if(Vn(E,p)){const v=ai(t,g),S=Si(E,p);yA(i,a,r,v,S,o,c,u)}else{const v=Ei(t);Na(v,d,r,c,u)&&Lu(v,i,a,r,o,c,u);const S=Ti(t,g);Na(S,d,r,c,u)&&Lu(S,i,a,r,o,c,u)}}const wA=["x","y","z"];function PA(t,i,a,r,o,c){Wt.setBuffer(t._roots[i]);const u=Bu(0,t,a,r,o,c);return Wt.clearBuffer(),u}function Bu(t,i,a,r,o,c){const{float32Array:u,uint16Array:d,uint32Array:p}=Wt;let g=t*2;if(Vn(g,d)){const _=ai(t,p),v=Si(g,d);return xA(i,a,r,_,v,o,c)}else{const _=Um(t,p),v=wA[_],U=r.direction[v]>=0;let w,T;U?(w=Ei(t),T=Ti(t,p)):(w=Ti(t,p),T=Ei(t));const x=Na(w,u,r,o,c)?Bu(w,i,a,r,o,c):null;if(x){const P=x.point[v];if(U?P<=u[T+_]:P>=u[T+_+3])return x}const b=Na(T,u,r,o,c)?Bu(T,i,a,r,o,c):null;return x&&b?x.distance<=b.distance?x:b:x||b||null}}const Yo=new zi,Os=new wi,Is=new wi,Lr=new Bn,Vh=new On,Ko=new On;function NA(t,i,a,r){Wt.setBuffer(t._roots[i]);const o=Ou(0,t,a,r);return Wt.clearBuffer(),o}function Ou(t,i,a,r,o=null){const{float32Array:c,uint16Array:u,uint32Array:d}=Wt;let p=t*2;if(o===null&&(a.boundingBox||a.computeBoundingBox(),Vh.set(a.boundingBox.min,a.boundingBox.max,r),o=Vh),Vn(p,u)){const E=i.geometry,_=E.index,v=E.attributes.position,S=a.index,U=a.attributes.position,w=ai(t,d),T=Si(p,u);if(Lr.copy(r).invert(),a.boundsTree)return Jt(t,c,Ko),Ko.matrix.copy(Lr),Ko.needsUpdate=!0,a.boundsTree.shapecast({intersectsBounds:x=>Ko.intersectsBox(x),intersectsTriangle:x=>{x.a.applyMatrix4(r),x.b.applyMatrix4(r),x.c.applyMatrix4(r),x.needsUpdate=!0;for(let R=w*3,b=(T+w)*3;R<b;R+=3)if(an(Is,R,_,v),Is.needsUpdate=!0,x.intersectsTriangle(Is))return!0;return!1}});for(let m=w*3,x=(T+w)*3;m<x;m+=3){an(Os,m,_,v),Os.a.applyMatrix4(Lr),Os.b.applyMatrix4(Lr),Os.c.applyMatrix4(Lr),Os.needsUpdate=!0;for(let R=0,b=S.count;R<b;R+=3)if(an(Is,R,S,U),Is.needsUpdate=!0,Os.intersectsTriangle(Is))return!0}}else{const E=t+8,_=d[t+6];return Jt(E,c,Yo),!!(o.intersectsBox(Yo)&&Ou(E,i,a,r,o)||(Jt(_,c,Yo),o.intersectsBox(Yo)&&Ou(_,i,a,r,o)))}}const Qo=new Bn,pu=new On,Br=new On,LA=new le,BA=new le,OA=new le,IA=new le;function FA(t,i,a,r={},o={},c=0,u=1/0){i.boundingBox||i.computeBoundingBox(),pu.set(i.boundingBox.min,i.boundingBox.max,a),pu.needsUpdate=!0;const d=t.geometry,p=d.attributes.position,g=d.index,E=i.attributes.position,_=i.index,v=Mi.getPrimitive(),S=Mi.getPrimitive();let U=LA,w=BA,T=null,m=null;o&&(T=OA,m=IA);let x=1/0,R=null,b=null;return Qo.copy(a).invert(),Br.matrix.copy(Qo),t.shapecast({boundsTraverseOrder:P=>pu.distanceToBox(P),intersectsBounds:(P,N,O)=>O<x&&O<u?(N&&(Br.min.copy(P.min),Br.max.copy(P.max),Br.needsUpdate=!0),!0):!1,intersectsRange:(P,N)=>{if(i.boundsTree)return i.boundsTree.shapecast({boundsTraverseOrder:I=>Br.distanceToBox(I),intersectsBounds:(I,y,M)=>M<x&&M<u,intersectsRange:(I,y)=>{for(let M=I,L=I+y;M<L;M++){an(S,3*M,_,E),S.a.applyMatrix4(a),S.b.applyMatrix4(a),S.c.applyMatrix4(a),S.needsUpdate=!0;for(let F=P,W=P+N;F<W;F++){an(v,3*F,g,p),v.needsUpdate=!0;const Q=v.distanceToTriangle(S,U,T);if(Q<x&&(w.copy(U),m&&m.copy(T),x=Q,R=F,b=M),Q<c)return!0}}}});{const O=er(i);for(let I=0,y=O;I<y;I++){an(S,3*I,_,E),S.a.applyMatrix4(a),S.b.applyMatrix4(a),S.c.applyMatrix4(a),S.needsUpdate=!0;for(let M=P,L=P+N;M<L;M++){an(v,3*M,g,p),v.needsUpdate=!0;const F=v.distanceToTriangle(S,U,T);if(F<x&&(w.copy(U),m&&m.copy(T),x=F,R=M,b=I),F<c)return!0}}}}}),Mi.releasePrimitive(v),Mi.releasePrimitive(S),x===1/0?null:(r.point?r.point.copy(w):r.point=w.clone(),r.distance=x,r.faceIndex=R,o&&(o.point?o.point.copy(m):o.point=m.clone(),o.point.applyMatrix4(Qo),w.applyMatrix4(Qo),o.distance=w.sub(o.point).length(),o.faceIndex=b),r)}function HA(t,i=null){i&&Array.isArray(i)&&(i=new Set(i));const a=t.geometry,r=a.index?a.index.array:null,o=a.attributes.position;let c,u,d,p,g=0;const E=t._roots;for(let v=0,S=E.length;v<S;v++)c=E[v],u=new Uint32Array(c),d=new Uint16Array(c),p=new Float32Array(c),_(0,g),g+=c.byteLength;function _(v,S,U=!1){const w=v*2;if(d[w+15]===vl){const m=u[v+6],x=d[w+14];let R=1/0,b=1/0,P=1/0,N=-1/0,O=-1/0,I=-1/0;for(let y=m,M=m+x;y<M;y++){const L=3*t.resolveTriangleIndex(y);for(let F=0;F<3;F++){let W=L+F;W=r?r[W]:W;const Q=o.getX(W),te=o.getY(W),G=o.getZ(W);Q<R&&(R=Q),Q>N&&(N=Q),te<b&&(b=te),te>O&&(O=te),G<P&&(P=G),G>I&&(I=G)}}return p[v+0]!==R||p[v+1]!==b||p[v+2]!==P||p[v+3]!==N||p[v+4]!==O||p[v+5]!==I?(p[v+0]=R,p[v+1]=b,p[v+2]=P,p[v+3]=N,p[v+4]=O,p[v+5]=I,!0):!1}else{const m=v+8,x=u[v+6],R=m+S,b=x+S;let P=U,N=!1,O=!1;i?P||(N=i.has(R),O=i.has(b),P=!N&&!O):(N=!0,O=!0);const I=P||N,y=P||O;let M=!1;I&&(M=_(m,S,P));let L=!1;y&&(L=_(x,S,P));const F=M||L;if(F)for(let W=0;W<3;W++){const Q=m+W,te=x+W,G=p[Q],ne=p[Q+3],K=p[te],de=p[te+3];p[v+W]=G<K?G:K,p[v+W+3]=ne>de?ne:de}return F}}}function zA(t,i,a,r,o,c,u){Wt.setBuffer(t._roots[i]),Iu(0,t,a,r,o,c,u),Wt.clearBuffer()}function Iu(t,i,a,r,o,c,u){const{float32Array:d,uint16Array:p,uint32Array:g}=Wt,E=t*2;if(Vn(E,p)){const v=ai(t,g),S=Si(E,p);bA(i,a,r,v,S,o,c,u)}else{const v=Ei(t);Na(v,d,r,c,u)&&Iu(v,i,a,r,o,c,u);const S=Ti(t,g);Na(S,d,r,c,u)&&Iu(S,i,a,r,o,c,u)}}const GA=["x","y","z"];function VA(t,i,a,r,o,c){Wt.setBuffer(t._roots[i]);const u=Fu(0,t,a,r,o,c);return Wt.clearBuffer(),u}function Fu(t,i,a,r,o,c){const{float32Array:u,uint16Array:d,uint32Array:p}=Wt;let g=t*2;if(Vn(g,d)){const _=ai(t,p),v=Si(g,d);return UA(i,a,r,_,v,o,c)}else{const _=Um(t,p),v=GA[_],U=r.direction[v]>=0;let w,T;U?(w=Ei(t),T=Ti(t,p)):(w=Ti(t,p),T=Ei(t));const x=Na(w,u,r,o,c)?Fu(w,i,a,r,o,c):null;if(x){const P=x.point[v];if(U?P<=u[T+_]:P>=u[T+_+3])return x}const b=Na(T,u,r,o,c)?Fu(T,i,a,r,o,c):null;return x&&b?x.distance<=b.distance?x:b:x||b||null}}const Zo=new zi,Fs=new wi,Hs=new wi,Or=new Bn,Xh=new On,jo=new On;function XA(t,i,a,r){Wt.setBuffer(t._roots[i]);const o=Hu(0,t,a,r);return Wt.clearBuffer(),o}function Hu(t,i,a,r,o=null){const{float32Array:c,uint16Array:u,uint32Array:d}=Wt;let p=t*2;if(o===null&&(a.boundingBox||a.computeBoundingBox(),Xh.set(a.boundingBox.min,a.boundingBox.max,r),o=Xh),Vn(p,u)){const E=i.geometry,_=E.index,v=E.attributes.position,S=a.index,U=a.attributes.position,w=ai(t,d),T=Si(p,u);if(Or.copy(r).invert(),a.boundsTree)return Jt(t,c,jo),jo.matrix.copy(Or),jo.needsUpdate=!0,a.boundsTree.shapecast({intersectsBounds:x=>jo.intersectsBox(x),intersectsTriangle:x=>{x.a.applyMatrix4(r),x.b.applyMatrix4(r),x.c.applyMatrix4(r),x.needsUpdate=!0;for(let R=w,b=T+w;R<b;R++)if(an(Hs,3*i.resolveTriangleIndex(R),_,v),Hs.needsUpdate=!0,x.intersectsTriangle(Hs))return!0;return!1}});for(let m=w,x=T+w;m<x;m++){const R=i.resolveTriangleIndex(m);an(Fs,3*R,_,v),Fs.a.applyMatrix4(Or),Fs.b.applyMatrix4(Or),Fs.c.applyMatrix4(Or),Fs.needsUpdate=!0;for(let b=0,P=S.count;b<P;b+=3)if(an(Hs,b,S,U),Hs.needsUpdate=!0,Fs.intersectsTriangle(Hs))return!0}}else{const E=t+8,_=d[t+6];return Jt(E,c,Zo),!!(o.intersectsBox(Zo)&&Hu(E,i,a,r,o)||(Jt(_,c,Zo),o.intersectsBox(Zo)&&Hu(_,i,a,r,o)))}}const Jo=new Bn,hu=new On,Ir=new On,WA=new le,qA=new le,kA=new le,YA=new le;function KA(t,i,a,r={},o={},c=0,u=1/0){i.boundingBox||i.computeBoundingBox(),hu.set(i.boundingBox.min,i.boundingBox.max,a),hu.needsUpdate=!0;const d=t.geometry,p=d.attributes.position,g=d.index,E=i.attributes.position,_=i.index,v=Mi.getPrimitive(),S=Mi.getPrimitive();let U=WA,w=qA,T=null,m=null;o&&(T=kA,m=YA);let x=1/0,R=null,b=null;return Jo.copy(a).invert(),Ir.matrix.copy(Jo),t.shapecast({boundsTraverseOrder:P=>hu.distanceToBox(P),intersectsBounds:(P,N,O)=>O<x&&O<u?(N&&(Ir.min.copy(P.min),Ir.max.copy(P.max),Ir.needsUpdate=!0),!0):!1,intersectsRange:(P,N)=>{if(i.boundsTree){const O=i.boundsTree;return O.shapecast({boundsTraverseOrder:I=>Ir.distanceToBox(I),intersectsBounds:(I,y,M)=>M<x&&M<u,intersectsRange:(I,y)=>{for(let M=I,L=I+y;M<L;M++){const F=O.resolveTriangleIndex(M);an(S,3*F,_,E),S.a.applyMatrix4(a),S.b.applyMatrix4(a),S.c.applyMatrix4(a),S.needsUpdate=!0;for(let W=P,Q=P+N;W<Q;W++){const te=t.resolveTriangleIndex(W);an(v,3*te,g,p),v.needsUpdate=!0;const G=v.distanceToTriangle(S,U,T);if(G<x&&(w.copy(U),m&&m.copy(T),x=G,R=W,b=M),G<c)return!0}}}})}else{const O=er(i);for(let I=0,y=O;I<y;I++){an(S,3*I,_,E),S.a.applyMatrix4(a),S.b.applyMatrix4(a),S.c.applyMatrix4(a),S.needsUpdate=!0;for(let M=P,L=P+N;M<L;M++){const F=t.resolveTriangleIndex(M);an(v,3*F,g,p),v.needsUpdate=!0;const W=v.distanceToTriangle(S,U,T);if(W<x&&(w.copy(U),m&&m.copy(T),x=W,R=M,b=I),W<c)return!0}}}}}),Mi.releasePrimitive(v),Mi.releasePrimitive(S),x===1/0?null:(r.point?r.point.copy(w):r.point=w.clone(),r.distance=x,r.faceIndex=R,o&&(o.point?o.point.copy(m):o.point=m.clone(),o.point.applyMatrix4(Jo),w.applyMatrix4(Jo),o.distance=w.sub(o.point).length(),o.faceIndex=b),r)}function QA(){return typeof SharedArrayBuffer<"u"}const qr=new Wt.constructor,dl=new Wt.constructor,Ra=new ef(()=>new zi),zs=new zi,Gs=new zi,mu=new zi,vu=new zi;let gu=!1;function ZA(t,i,a,r){if(gu)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");gu=!0;const o=t._roots,c=i._roots;let u,d=0,p=0;const g=new Bn().copy(a).invert();for(let E=0,_=o.length;E<_;E++){qr.setBuffer(o[E]),p=0;const v=Ra.getPrimitive();Jt(0,qr.float32Array,v),v.applyMatrix4(g);for(let S=0,U=c.length;S<U&&(dl.setBuffer(c[S]),u=Di(0,0,a,g,r,d,p,0,0,v),dl.clearBuffer(),p+=c[S].length,!u);S++);if(Ra.releasePrimitive(v),qr.clearBuffer(),d+=o[E].length,u)break}return gu=!1,u}function Di(t,i,a,r,o,c=0,u=0,d=0,p=0,g=null,E=!1){let _,v;E?(_=dl,v=qr):(_=qr,v=dl);const S=_.float32Array,U=_.uint32Array,w=_.uint16Array,T=v.float32Array,m=v.uint32Array,x=v.uint16Array,R=t*2,b=i*2,P=Vn(R,w),N=Vn(b,x);let O=!1;if(N&&P)E?O=o(ai(i,m),Si(i*2,x),ai(t,U),Si(t*2,w),p,u+i,d,c+t):O=o(ai(t,U),Si(t*2,w),ai(i,m),Si(i*2,x),d,c+t,p,u+i);else if(N){const I=Ra.getPrimitive();Jt(i,T,I),I.applyMatrix4(a);const y=Ei(t),M=Ti(t,U);Jt(y,S,zs),Jt(M,S,Gs);const L=I.intersectsBox(zs),F=I.intersectsBox(Gs);O=L&&Di(i,y,r,a,o,u,c,p,d+1,I,!E)||F&&Di(i,M,r,a,o,u,c,p,d+1,I,!E),Ra.releasePrimitive(I)}else{const I=Ei(i),y=Ti(i,m);Jt(I,T,mu),Jt(y,T,vu);const M=g.intersectsBox(mu),L=g.intersectsBox(vu);if(M&&L)O=Di(t,I,a,r,o,c,u,d,p+1,g,E)||Di(t,y,a,r,o,c,u,d,p+1,g,E);else if(M)if(P)O=Di(t,I,a,r,o,c,u,d,p+1,g,E);else{const F=Ra.getPrimitive();F.copy(mu).applyMatrix4(a);const W=Ei(t),Q=Ti(t,U);Jt(W,S,zs),Jt(Q,S,Gs);const te=F.intersectsBox(zs),G=F.intersectsBox(Gs);O=te&&Di(I,W,r,a,o,u,c,p,d+1,F,!E)||G&&Di(I,Q,r,a,o,u,c,p,d+1,F,!E),Ra.releasePrimitive(F)}else if(L)if(P)O=Di(t,y,a,r,o,c,u,d,p+1,g,E);else{const F=Ra.getPrimitive();F.copy(vu).applyMatrix4(a);const W=Ei(t),Q=Ti(t,U);Jt(W,S,zs),Jt(Q,S,Gs);const te=F.intersectsBox(zs),G=F.intersectsBox(Gs);O=te&&Di(y,W,r,a,o,u,c,p,d+1,F,!E)||G&&Di(y,Q,r,a,o,u,c,p,d+1,F,!E),Ra.releasePrimitive(F)}}return O}const $o=new On,Wh=new zi,jA={strategy:Am,maxDepth:40,maxLeafTris:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null};class tf{static serialize(i,a={}){a={cloneBuffers:!0,...a};const r=i.geometry,o=i._roots,c=i._indirectBuffer,u=r.getIndex();let d;return a.cloneBuffers?d={roots:o.map(p=>p.slice()),index:u?u.array.slice():null,indirectBuffer:c?c.slice():null}:d={roots:o,index:u?u.array:null,indirectBuffer:c},d}static deserialize(i,a,r={}){r={setIndex:!0,indirect:!!i.indirectBuffer,...r};const{index:o,roots:c,indirectBuffer:u}=i,d=new tf(a,{...r,[lu]:!0});if(d._roots=c,d._indirectBuffer=u||null,r.setIndex){const p=a.getIndex();if(p===null){const g=new ii(i.index,1,!1);a.setIndex(g)}else p.array!==o&&(p.array.set(o),p.needsUpdate=!0)}return d}get indirect(){return!!this._indirectBuffer}constructor(i,a={}){if(i.isBufferGeometry){if(i.index&&i.index.isInterleavedBufferAttribute)throw new Error("MeshBVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("MeshBVH: Only BufferGeometries are supported.");if(a=Object.assign({...jA,[lu]:!1},a),a.useSharedArrayBuffer&&!QA())throw new Error("MeshBVH: SharedArrayBuffer is not available.");this.geometry=i,this._roots=null,this._indirectBuffer=null,a[lu]||(pA(this,a),!i.boundingBox&&a.setBoundingBox&&(i.boundingBox=this.getBoundingBox(new zi))),this.resolveTriangleIndex=a.indirect?r=>this._indirectBuffer[r]:r=>r}refit(i=null){return(this.indirect?HA:RA)(this,i)}traverse(i,a=0){const r=this._roots[a],o=new Uint32Array(r),c=new Uint16Array(r);u(0);function u(d,p=0){const g=d*2,E=c[g+15]===vl;if(E){const _=o[d+6],v=c[g+14];i(p,E,new Float32Array(r,d*4,6),_,v)}else{const _=d+Wr/4,v=o[d+6],S=o[d+7];i(p,E,new Float32Array(r,d*4,6),S)||(u(_,p+1),u(v,p+1))}}}raycast(i,a=Pa,r=0,o=1/0){const c=this._roots,u=this.geometry,d=[],p=a.isMaterial,g=Array.isArray(a),E=u.groups,_=p?a.side:a,v=this.indirect?zA:DA;for(let S=0,U=c.length;S<U;S++){const w=g?a[E[S].materialIndex].side:_,T=d.length;if(v(this,S,w,i,d,r,o),g){const m=E[S].materialIndex;for(let x=T,R=d.length;x<R;x++)d[x].face.materialIndex=m}}return d}raycastFirst(i,a=Pa,r=0,o=1/0){const c=this._roots,u=this.geometry,d=a.isMaterial,p=Array.isArray(a);let g=null;const E=u.groups,_=d?a.side:a,v=this.indirect?VA:PA;for(let S=0,U=c.length;S<U;S++){const w=p?a[E[S].materialIndex].side:_,T=v(this,S,w,i,r,o);T!=null&&(g==null||T.distance<g.distance)&&(g=T,p&&(T.face.materialIndex=E[S].materialIndex))}return g}intersectsGeometry(i,a){let r=!1;const o=this._roots,c=this.indirect?XA:NA;for(let u=0,d=o.length;u<d&&(r=c(this,u,i,a),!r);u++);return r}shapecast(i){const a=Mi.getPrimitive(),r=this.indirect?CA:AA;let{boundsTraverseOrder:o,intersectsBounds:c,intersectsRange:u,intersectsTriangle:d}=i;if(u&&d){const _=u;u=(v,S,U,w,T)=>_(v,S,U,w,T)?!0:r(v,S,this,d,U,w,a)}else u||(d?u=(_,v,S,U)=>r(_,v,this,d,S,U,a):u=(_,v,S)=>S);let p=!1,g=0;const E=this._roots;for(let _=0,v=E.length;_<v;_++){const S=E[_];if(p=SA(this,_,c,u,o,g),p)break;g+=S.byteLength}return Mi.releasePrimitive(a),p}bvhcast(i,a,r){let{intersectsRanges:o,intersectsTriangles:c}=r;const u=Mi.getPrimitive(),d=this.geometry.index,p=this.geometry.attributes.position,g=this.indirect?U=>{const w=this.resolveTriangleIndex(U);an(u,w*3,d,p)}:U=>{an(u,U*3,d,p)},E=Mi.getPrimitive(),_=i.geometry.index,v=i.geometry.attributes.position,S=i.indirect?U=>{const w=i.resolveTriangleIndex(U);an(E,w*3,_,v)}:U=>{an(E,U*3,_,v)};if(c){const U=(w,T,m,x,R,b,P,N)=>{for(let O=m,I=m+x;O<I;O++){S(O),E.a.applyMatrix4(a),E.b.applyMatrix4(a),E.c.applyMatrix4(a),E.needsUpdate=!0;for(let y=w,M=w+T;y<M;y++)if(g(y),u.needsUpdate=!0,c(u,E,y,O,R,b,P,N))return!0}return!1};if(o){const w=o;o=function(T,m,x,R,b,P,N,O){return w(T,m,x,R,b,P,N,O)?!0:U(T,m,x,R,b,P,N,O)}}else o=U}return ZA(this,i,a,o)}intersectsBox(i,a){return $o.set(i.min,i.max,a),$o.needsUpdate=!0,this.shapecast({intersectsBounds:r=>$o.intersectsBox(r),intersectsTriangle:r=>$o.intersectsTriangle(r)})}intersectsSphere(i){return this.shapecast({intersectsBounds:a=>i.intersectsBox(a),intersectsTriangle:a=>a.intersectsSphere(i)})}closestPointToGeometry(i,a,r={},o={},c=0,u=1/0){return(this.indirect?KA:FA)(this,i,a,r,o,c,u)}closestPointToPoint(i,a={},r=0,o=1/0){return EA(this,i,a,r,o)}getBoundingBox(i){return i.makeEmpty(),this._roots.forEach(r=>{Jt(0,new Float32Array(r),Wh),i.union(Wh)}),i}}const JA=2,$A=1;class eR{constructor(i,a,r,o){ie(this,"scene");ie(this,"trackData");ie(this,"trackMesh");ie(this,"trackMaterial");ie(this,"pathCurve",null);ie(this,"highQualityMode",!0);ie(this,"placeTrackUnderCamera");ie(this,"trackUnderCameraVerticalOffset");ie(this,"trackRadius");ie(this,"trackPathPoints",[]);this.scene=i,this.trackData=a,this.trackMaterial=r,this.placeTrackUnderCamera=o.placeTrackUnderCamera,this.trackUnderCameraVerticalOffset=o.trackUnderCameraVerticalOffset,this.trackRadius=o.trackRadius,this.trackPathPoints=o.trackPathPoints,this.rebuildTrackGeometry()}rebuildTrackGeometry(){try{if(!this.trackPathPoints||this.trackPathPoints.length===0)return;const i=this.highQualityMode?this.trackPathPoints.length*JA:this.trackPathPoints.length*$A;let a=this.trackPathPoints.map(u=>u.clone());this.placeTrackUnderCamera&&(a=this.computeOffsetCurvePoints(this.trackPathPoints));const r=new bu(a);this.pathCurve=r;const o=new nS(r,Math.max(4,i),this.trackRadius,this.highQualityMode?8:6,!1),c=ru.acquire();if(c.copy(o),o.dispose(),c.boundsTree=new tf(c),!this.trackMesh)this.trackMesh=new gi(c,this.trackMaterial),this.trackMesh.frustumCulled=!0,this.scene.add(this.trackMesh);else{const u=this.trackMesh.geometry;ru.release(u),this.trackMesh.geometry=c}}catch(i){console.error("[TrackGeometryManager] rebuildTrackGeometry failed",i)}}computeOffsetCurvePoints(i){var c;const a=(c=this.trackData)==null?void 0:c.upVectors,r=i.length;if(!a||a.length===0){const u=new le(0,-this.trackUnderCameraVerticalOffset,0);return i.map(d=>d.clone().add(u))}const o=[];for(let u=0;u<r;u++){let d=new le(0,1,0);if(a.length>=2){const g=u/Math.max(1,r-1)*(a.length-1),E=Math.floor(g),_=Math.min(E+1,a.length-1),v=g-E,S=new le(a[E].x,a[E].y,a[E].z),U=new le(a[_].x,a[_].y,a[_].z);d=S.lerp(U,v).normalize()}else a.length===1&&(d=new le(a[0].x,a[0].y,a[0].z).normalize());const p=d.clone().multiplyScalar(-this.trackUnderCameraVerticalOffset);o.push(i[u].clone().add(p))}return o}getTrackMesh(){return this.trackMesh}getPathCurve(){return this.pathCurve}dispose(){this.trackMesh&&(this.scene.remove(this.trackMesh),ru.release(this.trackMesh.geometry))}}const el={low:{particleBudget:Math.floor(ft.PARTICLE_COUNT*.45),spawnBatch:Math.max(20,Math.floor(ft.PARTICLE_SPAWN_COUNT*.55)),gpuUpdateInterval:1/35},medium:{particleBudget:Math.floor(ft.PARTICLE_COUNT*.7),spawnBatch:Math.max(40,Math.floor(ft.PARTICLE_SPAWN_COUNT*.8)),gpuUpdateInterval:1/50},high:{particleBudget:ft.PARTICLE_COUNT,spawnBatch:ft.PARTICLE_SPAWN_COUNT,gpuUpdateInterval:0}};class tR{constructor(i){ie(this,"_dummy",new iS);ie(this,"_tempColor",new at);ie(this,"particleSystem",null);ie(this,"particleInstancedMesh",null);ie(this,"particleCursor",0);ie(this,"instanceFreeStack",[]);ie(this,"instanceStartTimes",null);ie(this,"instanceLifetimes",null);ie(this,"featureVisuals");ie(this,"featureCooldowns",{});ie(this,"ambientAccumulator",0);ie(this,"spawnOrigin",new le);ie(this,"spawnForward",new le);ie(this,"spawnRight",new le);ie(this,"spawnUp",new le);ie(this,"worldUp",new le(0,1,0));ie(this,"spawnWork",new le);ie(this,"texSize");ie(this,"synestheticSettings",null);ie(this,"consciousParticles",[]);ie(this,"consciousIdCounter",0);ie(this,"synapticGeometry",null);ie(this,"synapticMaterial",null);ie(this,"synapticLines",null);ie(this,"maxSynapticLinks",128);ie(this,"synapticColorA",new at("#7adfff"));ie(this,"synapticColorB",new at("#ff9efc"));ie(this,"synapticTemp",new le);ie(this,"synestheticUniforms",{neuralGain:.65,resonanceFloor:.35,persistence:.6});ie(this,"consciousnessIntensity",.9);ie(this,"gpuEnabled",!1);ie(this,"gpuRenderer",null);ie(this,"gpuPosRTA",null);ie(this,"gpuPosRTB",null);ie(this,"gpuVelRTA",null);ie(this,"gpuVelRTB",null);ie(this,"gpuQuadScene",null);ie(this,"gpuQuadCamera",null);ie(this,"gpuVelMaterial",null);ie(this,"gpuPosMaterial",null);ie(this,"gpuVelQuad",null);ie(this,"gpuPosQuad",null);ie(this,"gpuSwap",!1);ie(this,"rendererInfo",null);ie(this,"qualityLevel","high");ie(this,"particleBudget",el.high.particleBudget);ie(this,"spawnBatchSize",el.high.spawnBatch);ie(this,"gpuUpdateInterval",el.high.gpuUpdateInterval);ie(this,"gpuUpdateAccumulator",0);ie(this,"pendingUniforms",new Map);ie(this,"_frameSpawnCount",0);ie(this,"_maxFrameSpawns",200);this.scene=i,this.texSize=Math.ceil(Math.sqrt(ft.PARTICLE_COUNT)),this.featureVisuals=new Map([["subBass",{color:[1,.2,.1],sensitivity:1.2,size:2.5,lifetime:3.5,behavior:"flow"}],["bass",{color:[1,.4,.2],sensitivity:1,size:2,lifetime:3,behavior:"flow"}],["lowMid",{color:[.2,.8,1],sensitivity:.9,size:1.2,lifetime:2.5,behavior:"burst"}],["mid",{color:[.5,1,.8],sensitivity:.8,size:1,lifetime:2,behavior:"burst"}],["highMid",{color:[.8,1,.6],sensitivity:.7,size:.8,lifetime:1.8,behavior:"trail"}],["treble",{color:[1,.8,.8],sensitivity:.6,size:.6,lifetime:1.5,behavior:"trail"}],["sparkle",{color:[1,1,1],sensitivity:.65,size:.7,lifetime:1.2,behavior:"trail"}]]),this.buildParticleMeshes(),this.setQualityProfile(this.qualityLevel),this.applyConsciousUniforms(),this.setConsciousnessIntensity(this.consciousnessIntensity)}beginFrame(){this._frameSpawnCount=0}get instancedMesh(){return this.particleInstancedMesh}get points(){return this.particleSystem}registerFeatureVisual(i,a){const r=this.featureVisuals.get(i);if(r){this.featureVisuals.set(i,{...r,...a});return}const o={color:[1,1,1],sensitivity:1,size:1,lifetime:2,behavior:"burst",...a};this.featureVisuals.set(i,o)}applyConsciousUniforms(){this.applyShaderUniform("neuralGain",this.synestheticUniforms.neuralGain),this.applyShaderUniform("resonanceFloor",this.synestheticUniforms.resonanceFloor),this.applyShaderUniform("consciousnessPersistence",this.synestheticUniforms.persistence)}syncInstancedConsciousUniform(i){if(!this.particleInstancedMesh)return;const a=this.particleInstancedMesh.material;if(!a||!a.uniforms)return;const r=i??this.consciousnessIntensity;this.updateScalarUniform(a.uniforms.consciousnessIntensity,r,.001)}setConsciousnessIntensity(i){const a=Xt.clamp(i,.2,3);Math.abs(a-this.consciousnessIntensity)>.001?this.consciousnessIntensity=a:this.consciousnessIntensity=a,this.applyShaderUniform("consciousnessDrive",this.consciousnessIntensity),this.syncInstancedConsciousUniform()}updateScalarUniform(i,a,r=.001){if(!i)return;const o=typeof i.value=="number"?i.value:Number(i.value);(!Number.isFinite(o)||Math.abs(o-a)>r)&&(i.value=a)}setQualityProfile(i){const a=el[i];if(!a)return;const r=Math.max(1,Math.min(a.particleBudget,ft.PARTICLE_COUNT)),o=Math.max(1,Math.min(a.spawnBatch,r)),c=Math.max(0,a.gpuUpdateInterval);this.qualityLevel===i&&this.particleBudget===r&&this.spawnBatchSize===o&&Math.abs(this.gpuUpdateInterval-c)<1e-6||(this.qualityLevel=i,this.particleBudget=r,this.spawnBatchSize=o,this.gpuUpdateInterval=c,this._maxFrameSpawns=Math.max(100,Math.floor(this.particleBudget*.1)),this.particleCursor>=this.particleBudget&&(this.particleCursor=this.particleBudget>0?this.particleCursor%this.particleBudget:0),this.particleInstancedMesh&&(this.particleInstancedMesh.count=this.particleBudget,this.particleInstancedMesh.instanceMatrix.needsUpdate=!0,this.hideInstancesBeyondBudget()),this.rebuildFreeStackForBudget(),this.enforceBudgetOnPointsGeometry())}setConsciousnessSettings(i){if(!i){this.synestheticSettings=null,this.consciousParticles=[],this.fadeSynapticNetwork(!0),this.synestheticUniforms={neuralGain:.6,resonanceFloor:.3,persistence:.55},this.applyConsciousUniforms(),this.setConsciousnessIntensity(.8);return}const a=(u,d,p=0,g=1)=>Number.isFinite(u)?Xt.clamp(u,p,g):Xt.clamp(d,p,g),r=a(i.connectionDensity??.45,.45),o=a(i.resonanceThreshold??.4,.2),c=a(i.persistence??.55,0,1);this.synestheticSettings={connectionDensity:r,resonanceThreshold:o,lifespanSeconds:Math.max(.5,i.lifespanSeconds??4),persistence:c},this.synestheticUniforms={neuralGain:Xt.clamp(.55+r*.85,.4,1.6),resonanceFloor:Xt.clamp(o,.05,.95),persistence:c},this.applyConsciousUniforms(),this.setConsciousnessIntensity(.95+r*.4)}spawnMusicalThought(i,a,r,o){var d;const c=this.classifyThought(i),u={id:++this.consciousIdCounter,featureKey:i,thoughtType:c,position:r.clone(),velocity:new le((Math.random()-.5)*.2,(Math.random()-.5)*.2,(Math.random()-.5)*.2),resonance:a,createdAt:o,lifespan:((d=this.synestheticSettings)==null?void 0:d.lifespanSeconds)??4,emotionalResonance:a,synapticConnections:[]};this.consciousParticles.push(u),this.connectToHarmonicallyRelated(u)}classifyThought(i){return i.includes("melody")?"melody":i.includes("harmony")?"harmony":i.includes("rhythm")||i.includes("beat")?"rhythm":i.includes("texture")||i.includes("noise")?"texture":i.includes("bass")||i.includes("sub")?"rhythm":i.includes("mid")||i.includes("treble")?"harmony":"texture"}connectToHarmonicallyRelated(i){var c,u;if(!this.synestheticSettings)return;const a=this.synestheticSettings.resonanceThreshold??.4,r=Math.max(2,Math.round(this.maxSynapticLinks*(this.synestheticSettings.connectionDensity??.45)));let o=0;for(const d of this.consciousParticles){if(d.id===i.id)continue;const p=(i.resonance+d.resonance)*.5,g=i.position.distanceTo(d.position);p>a&&g<24&&o<r&&((c=i.synapticConnections)==null||c.push(d.id),(u=d.synapticConnections)==null||u.push(i.id),o++)}}applyShaderUniform(i,a){var o;if(this.pendingUniforms.set(i,a),!this.gpuEnabled)return;const r=[this.gpuVelMaterial,this.gpuPosMaterial];for(const c of r){const u=(o=c==null?void 0:c.uniforms)==null?void 0:o[i];u&&(typeof a=="number"?this.updateScalarUniform(u,a):u.value=a)}}rebuildFreeStackForBudget(){if(!this.instanceLifetimes||!this.instanceStartTimes){this.instanceFreeStack=[];return}const i=this.instanceLifetimes.length;for(let o=this.particleBudget;o<i;o++)this.instanceLifetimes[o]=0,this.instanceStartTimes[o]=0;const a=[],r=Math.min(this.particleBudget,i);for(let o=r-1;o>=0;o--)this.instanceLifetimes[o]<=0&&a.push(o);this.instanceFreeStack=a}hideInstancesBeyondBudget(){if(!this.particleInstancedMesh||this.particleBudget>=ft.PARTICLE_COUNT)return;const i=this._dummy;for(let a=this.particleBudget;a<ft.PARTICLE_COUNT;a++)i.position.set(0,-9999,0),i.scale.setScalar(0),i.updateMatrix(),this.particleInstancedMesh.setMatrixAt(a,i.matrix);this.particleInstancedMesh.instanceMatrix.needsUpdate=!0}enforceBudgetOnPointsGeometry(){if(!this.particleSystem)return;const i=this.particleSystem.geometry,a=i.getAttribute("position"),r=i.getAttribute("velocity"),o=i.getAttribute("startTime");if(!a)return;const c=Math.min(this.particleBudget,a.count);if(c<a.count){for(let u=c;u<a.count;u++){const d=u*3;a.array[d+0]=0,a.array[d+1]=-9999,a.array[d+2]=0,r&&(r.array[d+0]=0,r.array[d+1]=0,r.array[d+2]=0),o&&(o.array[u]=0)}a.updateRange={offset:c*3,count:(a.count-c)*3},a.needsUpdate=!0,r&&(r.updateRange={offset:c*3,count:(r.count-c)*3},r.needsUpdate=!0),o&&(o.updateRange={offset:c,count:o.count-c},o.needsUpdate=!0)}}applyPendingUniforms(){var a;if(!this.gpuEnabled||!this.pendingUniforms.size)return;const i=[this.gpuVelMaterial,this.gpuPosMaterial];for(const[r,o]of this.pendingUniforms.entries())for(const c of i){const u=(a=c==null?void 0:c.uniforms)==null?void 0:a[r];u&&(typeof o=="number"?this.updateScalarUniform(u,o):u.value=o)}}updateConsciousness(i){if(!this.synestheticSettings){this.fadeSynapticNetwork(!1),this.setConsciousnessIntensity(Xt.lerp(this.consciousnessIntensity,.75,.12));return}if(this.ensureSynapticNetwork(),!this.synapticGeometry||!this.synapticMaterial)return;const a=this.synestheticSettings,r=Math.max(.5,a.lifespanSeconds??4),o=Xt.clamp(a.persistence??.55,0,1),c=[];let u=0;for(const M of this.consciousParticles){const L=i.nowSeconds-M.createdAt;if(L>M.lifespan||L>r)continue;const F=Math.max(0,Math.min(1,(i.audioFeatures[M.featureKey]||0)*i.segmentIntensityBoost));M.resonance=Xt.lerp(M.resonance,F,.18),u+=M.resonance,M.velocity.multiplyScalar(.92),M.velocity.addScaledVector(this.worldUp,(F-.45)*.05),this.synapticTemp.set((Math.random()-.5)*.025,0,(Math.random()-.5)*.025),M.velocity.add(this.synapticTemp),M.position.add(M.velocity),c.push(M)}this.consciousParticles=c;const d=this.synapticGeometry,p=d.getAttribute("position"),g=d.getAttribute("color");if(!p||!g)return;const E=Xt.clamp(a.connectionDensity??.45,0,1),_=Xt.clamp(a.resonanceThreshold??.4,0,1),v=Math.max(0,Math.min(this.maxSynapticLinks,Math.round(this.maxSynapticLinks*E))),S=this.consciousParticles.length;let U=0;const w=this.synapticColorA.r,T=this.synapticColorA.g,m=this.synapticColorA.b,x=this.synapticColorB.r,R=this.synapticColorB.g,b=this.synapticColorB.b;if(v>0&&S>=2)for(let M=0;M<S&&U<v;M++){const L=this.consciousParticles[M];for(let F=M+1;F<S&&U<v;F++){const W=this.consciousParticles[F],Q=(L.resonance+W.resonance)*.5;if(Q<_||L.position.distanceTo(W.position)>28)continue;const G=U*6;p.array[G+0]=L.position.x,p.array[G+1]=L.position.y,p.array[G+2]=L.position.z,p.array[G+3]=W.position.x,p.array[G+4]=W.position.y,p.array[G+5]=W.position.z;const ne=Xt.lerp(w,x,Q),K=Xt.lerp(T,R,Q),de=Xt.lerp(m,b,Q);g.array[G+0]=ne,g.array[G+1]=K,g.array[G+2]=de,g.array[G+3]=ne,g.array[G+4]=K,g.array[G+5]=de,U++}}if(d.setDrawRange(0,U*2),p.needsUpdate=U>0,g.needsUpdate=U>0,this.synapticMaterial&&this.synapticLines){const M=U>0?Math.min(1,.25+U/Math.max(1,v)*.75):0;this.synapticMaterial.opacity=Xt.lerp(this.synapticMaterial.opacity,M,U>0?.18:(1-o)*.12+.02),this.synapticLines.visible=this.synapticMaterial.opacity>.02}const P=S>0?u/S:0,N=v>0?U/v:0,O=E,I=Xt.clamp(.45+P*1.2+N*.9+O*.6,.3,2.5),y=Xt.lerp(this.consciousnessIntensity,I,U>0?.25:.12*(1-o));this.setConsciousnessIntensity(y)}ensureSynapticNetwork(){if(this.synapticLines&&this.synapticGeometry&&this.synapticMaterial)return;const i=new as,a=new Float32Array(this.maxSynapticLinks*2*3),r=new Float32Array(this.maxSynapticLinks*2*3);i.setAttribute("position",new ii(a,3)),i.setAttribute("color",new ii(r,3)),i.setDrawRange(0,0);const o=new aS({transparent:!0,opacity:0,vertexColors:!0,blending:qs,depthWrite:!1}),c=new sS(i,o);c.frustumCulled=!1,c.renderOrder=11,this.scene.add(c),this.synapticGeometry=i,this.synapticMaterial=o,this.synapticLines=c}fadeSynapticNetwork(i){if(!(!this.synapticMaterial||!this.synapticGeometry||!this.synapticLines)){if(i){this.synapticMaterial.opacity=0,this.synapticLines.visible=!1,this.synapticGeometry.setDrawRange(0,0);return}this.synapticMaterial.opacity=Xt.lerp(this.synapticMaterial.opacity,0,.12),this.synapticMaterial.opacity<.02&&(this.synapticLines.visible=!1,this.synapticGeometry.setDrawRange(0,0))}}driveReactiveParticles(i,a){if(i.currentLOD==="low"||!this.particleInstancedMesh&&!this.particleSystem)return this.updateConsciousness({nowSeconds:i.nowSeconds,audioFeatures:i.audioFeatures,segmentIntensityBoost:i.segmentIntensityBoost}),a;const{nowSeconds:r,deltaSeconds:o,cameraPosition:c,lookAtPosition:u,audioFeatures:d,segmentIntensityBoost:p}=i;if(this.spawnForward.subVectors(u,c),this.spawnForward.lengthSq()<1e-6)return a;this.spawnForward.normalize(),this.spawnRight.copy(this.spawnForward).cross(this.worldUp),this.spawnRight.lengthSq()<1e-6?this.spawnRight.set(1,0,0):this.spawnRight.normalize(),this.spawnUp.copy(this.spawnRight).cross(this.spawnForward),this.spawnUp.lengthSq()<1e-6?this.spawnUp.copy(this.worldUp):this.spawnUp.normalize(),this.spawnOrigin.copy(c).addScaledVector(this.spawnForward,8).addScaledVector(this.spawnUp,2);const g=[{feature:"bass",threshold:.35,cooldown:.16,lateral:-2.8,forward:.5},{feature:"mid",threshold:.32,cooldown:.22,lateral:2.8,forward:1.8},{feature:"treble",threshold:.28,cooldown:.28,lateral:.4,forward:3.8},{feature:"sparkle",threshold:.3,cooldown:.18,lateral:0,forward:0}];for(const E of g){const _=d[E.feature]??0;if(_<=0)continue;const v=this.featureVisuals.get(E.feature);if(!v)continue;const S=v.sensitivity,U=Math.min(1,_*S*p);if(U<E.threshold)continue;const w=this.featureCooldowns[E.feature]??0;if(r-w<E.cooldown)continue;this.spawnWork.copy(this.spawnOrigin).addScaledVector(this.spawnRight,E.lateral+(Math.random()-.5)*1.5).addScaledVector(this.spawnForward,E.forward+(Math.random()-.5)*1),this.spawnFeatureBurst(E.feature,U,this.spawnWork,d,p,r),this.featureCooldowns[E.feature]=r;const T=E.feature==="bass"||E.feature==="subBass"?U*.9:U*.45;a=Math.min(1.5,a+T)}if(this.ambientAccumulator+=o*(1.1+i.gpuAudioForce*.8),this.ambientAccumulator>=.45){const E=Math.max(1,Math.floor(this.ambientAccumulator/.45));this.ambientAccumulator-=E*.45;for(let _=0;_<E;_++)this.spawnWork.copy(this.spawnOrigin).addScaledVector(this.spawnForward,1.2+(Math.random()-.5)*1.5).addScaledVector(this.spawnRight,(Math.random()-.5)*3.5),this.spawnFeatureBurst("sparkle",.45+Math.random()*.4,this.spawnWork,d,p,r),a=Math.min(1.5,a+.25)}return this.updateConsciousness({nowSeconds:r,audioFeatures:d,segmentIntensityBoost:p}),a}spawnParticles(i,a){if(!this.particleSystem)return;const{origin:r,feature:o,audioFeatures:c,segmentIntensityBoost:u,nowSeconds:d}=a,p=this.spawnBatchSize,g=i>0?Math.min(i,p):p;if(this.particleInstancedMesh){this.spawnInstanceBatch(g,a,d);return}this.spawnPointsBatch(g,r,o,c,u,d)}spawnFeatureBurst(i,a,r,o,c,u){const d=Math.max(0,Math.min(1,a)),p=this.spawnBatchSize,g=Math.max(1,Math.round(p*(.5+d*2)));this.spawnParticles(g,{origin:r,feature:i,audioFeatures:o,segmentIntensityBoost:c,nowSeconds:u}),this.registerConsciousParticle(i,r,d,c,u)}seedAmbientField(i,a,r,o,c,u){if(!i||a<=0||r<=0)return;const d=Math.max(1,a),p=["sparkle","highMid","mid","lowMid","treble"],g=this.spawnForward,E=this.spawnRight,_=this.spawnUp,v=this.spawnWork;for(let S=0;S<d;S++){const U=(S+Math.random()*.35)/d;i.getPointAt(U%1,v),i.getTangentAt(U%1,g),g.lengthSq()<1e-6&&g.set(0,0,1),E.copy(this.worldUp).cross(g).normalize(),E.lengthSq()<1e-6&&E.set(1,0,0),_.copy(g).cross(E).normalize();const w=r*(.4+Math.random()*.8),T=(Math.random()-.5)*w,m=(Math.random()-.5)*w*.6,x=(Math.random()-.5)*w*.45;v.addScaledVector(E,T),v.addScaledVector(_,m),v.addScaledVector(g,x);const R=p[S%p.length],b=.45+Math.random()*.55;this.spawnFeatureBurst(R,b,v,c,u,o-Math.random()*2.5)}}reclaimExpired(i){if(!this.particleInstancedMesh||!this.instanceStartTimes||!this.instanceLifetimes)return;const a=this._dummy,r=this.particleInstancedMesh.count;let o=0;for(let c=0;c<r;c++){const u=this.instanceStartTimes[c],d=this.instanceLifetimes[c];d>0&&i-u>=d&&(this.freeInstance(c),a.position.set(0,0,0),a.scale.setScalar(0),a.updateMatrix(),this.particleInstancedMesh.setMatrixAt(c,a.matrix),o++)}o>0&&(this.particleInstancedMesh.instanceMatrix.needsUpdate=!0)}updatePointsMaterial(i,a,r,o){if(this.particleSystem)try{const c=this.particleSystem.material,u=i.bass||0,d=.7+this.consciousnessIntensity*.25+a*.12,p=ft.PARTICLE_BASE_SIZE*(1+u*1.2*a)*d;c.size=Xt.lerp(c.size||ft.PARTICLE_BASE_SIZE,p,.06);const g=this._tempColor.copy(r).lerp(o,.45),E=Math.min(.65,this.consciousnessIntensity*.28);E>.001&&g.lerp(this.synapticColorB,E),c.color.lerp(g,.02),c.needsUpdate=!0}catch{}}applyLOD(i){i==="low"?(this.particleInstancedMesh&&(this.particleInstancedMesh.visible=!1),this.particleSystem&&!this.particleSystem.parent&&this.scene.add(this.particleSystem),this.particleSystem&&(this.particleSystem.visible=!0)):(this.particleInstancedMesh&&(this.particleInstancedMesh.visible=!0),this.particleSystem&&this.particleSystem.parent===this.scene&&this.scene.remove(this.particleSystem),this.particleSystem&&(this.particleSystem.visible=!1))}switchToFallback(){console.warn("[VisualEffects] Switching to fallback particle system (THREE.Points)."),this.particleInstancedMesh&&(this.particleInstancedMesh.visible=!1),this.particleSystem&&(this.particleSystem.parent||this.scene.add(this.particleSystem),this.particleSystem.visible=!0)}dispose(){if(this.particleInstancedMesh){try{this.scene.remove(this.particleInstancedMesh),this.particleInstancedMesh.geometry.dispose(),this.particleInstancedMesh.material.dispose()}catch{}this.particleInstancedMesh=null}if(this.particleSystem){try{this.scene.remove(this.particleSystem),this.particleSystem.geometry.dispose(),this.particleSystem.material.dispose()}catch{}this.particleSystem=null}if(this.synapticLines){try{this.scene.remove(this.synapticLines),this.synapticLines.geometry.dispose()}catch{}if(this.synapticMaterial)try{this.synapticMaterial.dispose()}catch{}this.synapticGeometry=null,this.synapticMaterial=null,this.synapticLines=null}this.disposeGPU()}isGPUEnabled(){return this.gpuEnabled}validateParticleLayout(){if(!this.particleInstancedMesh)return!1;const i=ft.PARTICLE_COUNT,a=this.particleInstancedMesh.count,r=Math.ceil(Math.sqrt(i)),o=r*r;return a!==i?(console.error(`[ParticleSystem] Instance count mismatch: expected ${i}, got ${a}`),!1):o<i?(console.error(`[ParticleSystem] Texture too small: ${r}x${r} (${o}) < ${i}`),!1):!0}detectRenderer(){if(this.rendererInfo!==null)return this.rendererInfo;try{const i=document.createElement("canvas"),a=i.getContext("webgl2")||i.getContext("webgl");if(!a)return this.rendererInfo={ok:!1,renderer:"no-webgl",vendor:"unknown"},this.rendererInfo;const r=a.getExtension&&a.getExtension("WEBGL_debug_renderer_info"),o=r?a.getParameter(r.UNMASKED_RENDERER_WEBGL):a.getParameter(a.RENDERER),c=r?a.getParameter(r.UNMASKED_VENDOR_WEBGL):a.getParameter(a.VENDOR);return this.rendererInfo={ok:!0,renderer:o||"unknown",vendor:c||"unknown"},this.rendererInfo}catch{return this.rendererInfo={ok:!1,renderer:"error",vendor:"error"},this.rendererInfo}}validateFloatRenderTargets(i){const a=i.getContext();if(!(typeof WebGL2RenderingContext<"u"&&a instanceof WebGL2RenderingContext))return console.warn("[GPU Particles] WebGL2 is not available."),!1;if(!a.getExtension("EXT_color_buffer_float"))return console.warn("[GPU Particles] EXT_color_buffer_float extension is not available."),!1;const c=new $t(1,1,{format:bn,type:_i});try{i.setRenderTarget(c);const u=a.checkFramebufferStatus(a.FRAMEBUFFER);i.setRenderTarget(null),c.dispose();const d=u===a.FRAMEBUFFER_COMPLETE;return d||console.warn(`[GPU Particles] Float render target framebuffer check failed with status: ${u}.`),d}catch(u){return console.error("[GPU Particles] Error during float render target validation:",u),c.dispose(),!1}}disposeGPU(){this.gpuPosRTA&&(this.gpuPosRTA.dispose(),this.gpuPosRTA=null),this.gpuPosRTB&&(this.gpuPosRTB.dispose(),this.gpuPosRTB=null),this.gpuVelRTA&&(this.gpuVelRTA.dispose(),this.gpuVelRTA=null),this.gpuVelRTB&&(this.gpuVelRTB.dispose(),this.gpuVelRTB=null),this.gpuVelMaterial&&(this.gpuVelMaterial.dispose(),this.gpuVelMaterial=null),this.gpuPosMaterial&&(this.gpuPosMaterial.dispose(),this.gpuPosMaterial=null),this.gpuQuadScene&&(this.gpuQuadScene.clear(),this.gpuQuadScene=null),this.gpuQuadCamera&&(this.gpuQuadCamera=null),this.gpuVelQuad&&(this.gpuVelQuad.geometry.dispose(),this.gpuVelQuad=null),this.gpuPosQuad&&(this.gpuPosQuad.geometry.dispose(),this.gpuPosQuad=null),this.gpuRenderer=null,this.gpuEnabled=!1}async initGPU(i,a){const r=this.particleInstancedMesh;if(!r){console.log("[GPU Particles] No instanced mesh available, skipping GPU init.");return}if(!this.validateFloatRenderTargets(i)){const o=this.detectRenderer();console.warn(`[GPU Particles] GPU particle system requires WebGL2 + float render-target support. Falling back to CPU particles. renderer=${o.renderer}, vendor=${o.vendor}`),this.switchToFallback();return}try{this.gpuRenderer=i;const o=this.texSize;let c=Lo("/shaders/velFrag.resolved.glsl"),u=Lo("/shaders/posFrag.resolved.glsl");if(!c)try{const I=await fetch("/shaders/velFrag.resolved.glsl");I.ok&&(c=await I.text())}catch{}if(!u)try{const I=await fetch("/shaders/posFrag.resolved.glsl");I.ok&&(u=await I.text())}catch{}let d=Lo("/shaders/baseVelFrag.glsl")||"",p=Lo("/shaders/basePosFrag.glsl")||"";if((!c||!u)&&(!d||!p))try{if(!d){const I=await fetch("/shaders/baseVelFrag.glsl");I.ok&&(d=await I.text())}if(!p){const I=await fetch("/shaders/basePosFrag.glsl");I.ok&&(p=await I.text())}}catch{}let g=rS();if(!g&&(!c||!u))try{try{const y=await import(window.location.origin+"/lygia/resolve.esm.js");g=y&&(y.default||y.resolveLygia||y.resolve)?y.default||y.resolveLygia||y.resolve:null}catch{g=null}}catch{try{const M=await import("https://lygia.xyz/resolve.esm.js");g=M&&(M.default||M.resolveLygia||M.resolve)?M.default||M.resolveLygia||M.resolve:null}catch{g=null}}const E=o*o,_=new Float32Array(E*4),v=new Float32Array(E*4),S=new Bn,U=new le;for(let I=0;I<ft.PARTICLE_COUNT;I++){const y=I*4;let M=0;try{r?(r.getMatrixAt(I,S),S.multiplyMatrices(r.matrixWorld,S),U.setFromMatrixPosition(S)):U.set(0,-9999,0),r&&r.geometry.getAttribute("instanceSpeed")&&(M=r.geometry.getAttribute("instanceSpeed").array[I]||0)}catch{U.set(0,-9999,0)}_[y+0]=U.x,_[y+1]=U.y,_[y+2]=U.z,_[y+3]=1,v[y+0]=M,v[y+1]=0,v[y+2]=0,v[y+3]=0}const w=new Ru(_,o,o,bn,_i);w.needsUpdate=!0;for(let I=0;I<E;I++)v[I*4+0]=0,v[I*4+1]=0,v[I*4+2]=0,v[I*4+3]=0;const T=new Ru(v,o,o,bn,_i);T.needsUpdate=!0,this.gpuQuadScene=new fl,this.gpuQuadCamera=new ku(-1,1,1,-1,0,1),d||(d=`
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
            `),c&&c.includes("#include")&&(c=null),c&&["subBass","lowMid","highMid","sparkle"].some(M=>!new RegExp(`uniform\\s+float\\s+${M}\\b`).test(c))&&(console.warn("[GPU Particles] Resolved velocity shader missing expected audio uniforms; falling back to base shader."),c=null),u&&u.includes("#include")&&(u=null);let x=d;if(c)x=c;else if(g)try{const y=g(`#include "lygia/generative/simplex.glsl"
#include "lygia/generative/curl.glsl"
#include "lygia/color/palettes.glsl"
`+d);typeof y=="string"&&y.length>32&&!y.includes("Path ")&&!y.toLowerCase().includes("not found")&&(y.includes("void main")||y.includes("gl_FragColor")||y.includes("gl_FragData"))?x=y:x=d}catch{x=d}const R=new rn({uniforms:{prevVel:{value:T},prevPos:{value:w},audioForce:{value:0},curlStrength:{value:a.curlStrength},noiseScale:{value:a.noiseScale},noiseSpeed:{value:a.noiseSpeed},subBass:{value:0},bass:{value:0},lowMid:{value:0},mid:{value:0},highMid:{value:0},treble:{value:0},sparkle:{value:0},neuralGain:{value:this.synestheticUniforms.neuralGain},resonanceFloor:{value:this.synestheticUniforms.resonanceFloor},consciousnessPersistence:{value:this.synestheticUniforms.persistence},consciousnessDrive:{value:this.consciousnessIntensity},time:{value:0},dt:{value:1/60},texSize:{value:o}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }",fragmentShader:x,depthTest:!1,depthWrite:!1});p||(p=`
              precision highp float; varying vec2 vUv;
              uniform sampler2D prevPos; uniform sampler2D velTex; uniform float dt;
              void main(){
                vec3 p = texture2D(prevPos, vUv).rgb;
                vec3 v = texture2D(velTex, vUv).rgb;
                p += v * dt;
                if (p.y < -100.0) p.y = -9999.0;
                gl_FragColor = vec4(p, 1.0);
              }
            `);let P=p;if(u)P=u;else if(g)try{const y=g(`#include "lygia/generative/simplex.glsl"
`+p);typeof y=="string"&&y.length>32&&!y.includes("Path ")&&!y.toLowerCase().includes("not found")&&(y.includes("void main")||y.includes("gl_FragColor")||y.includes("gl_FragData"))?P=y:P=p}catch{P=p}const N=new rn({uniforms:{prevPos:{value:w},velTex:{value:T},dt:{value:1/60},texSize:{value:o}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }",fragmentShader:P,depthTest:!1,depthWrite:!1});this.gpuVelMaterial=R,this.gpuPosMaterial=N,this.gpuVelQuad=new gi(new ll(2,2),this.gpuVelMaterial),this.gpuPosQuad=new gi(new ll(2,2),this.gpuPosMaterial),this.gpuVelQuad.visible=!1,this.gpuPosQuad.visible=!1,this.gpuQuadScene.add(this.gpuVelQuad),this.gpuQuadScene.add(this.gpuPosQuad);const O={minFilter:yi,magFilter:yi,type:_i,format:bn};this.gpuVelRTA=new $t(o,o,O),this.gpuVelRTB=new $t(o,o,O),this.gpuPosRTA=new $t(o,o,O),this.gpuPosRTB=new $t(o,o,O),this.gpuVelMaterial.uniforms.prevVel.value=T,this.gpuVelMaterial.uniforms.prevPos.value=w,i.setRenderTarget(this.gpuVelRTA),i.render(this.gpuQuadScene,this.gpuQuadCamera),i.setRenderTarget(null),this.gpuPosMaterial.uniforms.prevPos.value=w,this.gpuPosMaterial.uniforms.velTex.value=T,i.setRenderTarget(this.gpuPosRTA),i.render(this.gpuQuadScene,this.gpuQuadCamera),i.setRenderTarget(null),this.gpuSwap=!1,this.gpuEnabled=!0,this.applyPendingUniforms()}catch(o){const c=this.detectRenderer();console.error(`[GPU Particles] Failed to initialize GPU particle system. renderer=${c.renderer}, vendor=${c.vendor}`,o),this.gpuEnabled=!1,this.switchToFallback()}}updateGPU(i,a){if(!(!this.gpuEnabled||!this.gpuRenderer||!this.gpuQuadScene||!this.gpuQuadCamera)&&this.particleInstancedMesh){if(this.gpuUpdateInterval>0){if(this.gpuUpdateAccumulator+=i,this.gpuUpdateAccumulator<this.gpuUpdateInterval)return;this.gpuUpdateAccumulator=0}this.applyPendingUniforms();try{const r=this.gpuPosRTA.width,o=this.gpuSwap?this.gpuPosRTB:this.gpuPosRTA,c=this.gpuSwap?this.gpuVelRTB:this.gpuVelRTA,u=this.gpuSwap?this.gpuVelRTA:this.gpuVelRTB,d=this.gpuSwap?this.gpuPosRTA:this.gpuPosRTB;try{const p=this.gpuVelMaterial;this.updateScalarUniform(p.uniforms.time,performance.now()/1e3,.005),this.updateScalarUniform(p.uniforms.dt,i,1e-4),this.updateScalarUniform(p.uniforms.texSize,r,0),p.uniforms.prevVel.value=c.texture,p.uniforms.prevPos.value=o.texture;const g=a.segmentIntensityBoost;this.updateScalarUniform(p.uniforms.subBass,(a.audioFeatures.subBass||0)*g),this.updateScalarUniform(p.uniforms.bass,(a.audioFeatures.bass||0)*g),this.updateScalarUniform(p.uniforms.lowMid,(a.audioFeatures.lowMid||0)*g),this.updateScalarUniform(p.uniforms.mid,(a.audioFeatures.mid||0)*g),this.updateScalarUniform(p.uniforms.highMid,(a.audioFeatures.highMid||0)*g),this.updateScalarUniform(p.uniforms.treble,(a.audioFeatures.treble||0)*g),this.updateScalarUniform(p.uniforms.sparkle,(a.audioFeatures.sparkle||0)*g),this.updateScalarUniform(p.uniforms.audioForce,a.gpuAudioForce||0),this.updateScalarUniform(p.uniforms.curlStrength,a.curlStrength,.001),this.updateScalarUniform(p.uniforms.noiseScale,a.noiseScale,.001),this.updateScalarUniform(p.uniforms.noiseSpeed,a.noiseSpeed,.001),this.updateScalarUniform(p.uniforms.neuralGain,this.synestheticUniforms.neuralGain,.001),this.updateScalarUniform(p.uniforms.resonanceFloor,this.synestheticUniforms.resonanceFloor,.001),this.updateScalarUniform(p.uniforms.consciousnessPersistence,this.synestheticUniforms.persistence,.001);const E=(a.audioFeatures.bass||0)*.6+(a.audioFeatures.mid||0)*.4+(a.audioFeatures.sparkle||0)*.3,_=Math.min(2.6,this.consciousnessIntensity*(.7+a.segmentIntensityBoost*.45)+E*.6);this.updateScalarUniform(p.uniforms.consciousnessDrive,_,.001),this.syncInstancedConsciousUniform(_)}catch{}this.gpuVelQuad.visible=!0,this.gpuRenderer.setRenderTarget(u),this.gpuRenderer.render(this.gpuQuadScene,this.gpuQuadCamera),this.gpuVelQuad.visible=!1;try{const p=this.gpuPosMaterial;this.updateScalarUniform(p.uniforms.dt,i,1e-4),p.uniforms.prevPos.value=o.texture,p.uniforms.velTex.value=u.texture}catch{}this.gpuPosQuad.visible=!0,this.gpuRenderer.setRenderTarget(d),this.gpuRenderer.render(this.gpuQuadScene,this.gpuQuadCamera),this.gpuPosQuad.visible=!1,this.gpuRenderer.setRenderTarget(null);try{const p=this.particleInstancedMesh.material;p.uniforms.posTex.value=d.texture,this.updateScalarUniform(p.uniforms.texSize,r,0),p.needsUpdate=!0}catch{}this.gpuSwap=!this.gpuSwap}catch{this.gpuEnabled=!1,this.switchToFallback()}}}buildParticleMeshes(){const i=ft.PARTICLE_COUNT;try{const u=new oS(1,6,4),d=new fm({color:16777215});this.particleInstancedMesh=new lS(u,d,i),this.particleInstancedMesh.instanceMatrix.setUsage(cS),this.particleInstancedMesh.frustumCulled=!1,this.particleInstancedMesh.renderOrder=10;const p=this._dummy;for(let v=0;v<i;v++)p.position.set(0,0,0),p.scale.setScalar(0),p.updateMatrix(),this.particleInstancedMesh.setMatrixAt(v,p.matrix);try{const v=new Float32Array(i*3),S=new Float32Array(i),U=new Float32Array(i*3),w=new Float32Array(i),T=new Dr(v,3),m=new Dr(S,1),x=new Dr(U,3),R=new Dr(w,1);this.particleInstancedMesh.geometry.setAttribute("instanceColor",T),this.particleInstancedMesh.geometry.setAttribute("instanceSpeed",m),this.particleInstancedMesh.geometry.setAttribute("instancePosition",x),this.particleInstancedMesh.geometry.setAttribute("instanceScale",R)}catch{}try{const v=new Float32Array(i),S=new Dr(v,1);this.particleInstancedMesh.geometry.setAttribute("instanceFeature",S)}catch{}const g=`
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
        `,E=`
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
        `,_=new rn({uniforms:{posTex:{value:null},texSize:{value:0},consciousnessIntensity:{value:this.consciousnessIntensity}},vertexShader:g,fragmentShader:E,transparent:!0,depthWrite:!1,depthTest:!1,blending:qs});this.particleInstancedMesh.material=_,this.particleInstancedMesh.matrixAutoUpdate=!1,this.particleInstancedMesh.matrix.identity(),this.particleInstancedMesh.count=this.particleBudget,this.scene.add(this.particleInstancedMesh),this.validateParticleLayout()}catch{}const a=new Float32Array(i*3),r=new Float32Array(i*3),o=new Float32Array(i),c=new as;if(c.setAttribute("position",new ii(a,3)),c.setAttribute("velocity",new ii(r,3)),c.setAttribute("startTime",new ii(o,1)),c.attributes.position.updateRange={offset:0,count:0},c.attributes.velocity.updateRange={offset:0,count:0},c.attributes.startTime.updateRange={offset:0,count:0},this.particleSystem=new uS(c,new fS({size:ft.PARTICLE_BASE_SIZE,color:16777215,transparent:!0,depthWrite:!1,depthTest:!1,blending:qs,sizeAttenuation:!0})),this.particleInstancedMesh||this.scene.add(this.particleSystem),this.particleInstancedMesh){this.instanceStartTimes=new Float32Array(i),this.instanceLifetimes=new Float32Array(i);for(let u=i-1;u>=0;u--)this.instanceFreeStack.push(u),this.instanceStartTimes[u]=0,this.instanceLifetimes[u]=0}}spawnInstanceBatch(i,a,r){if(!this.particleInstancedMesh||this.particleBudget<=0)return;const c=this._maxFrameSpawns-this._frameSpawnCount,u=Math.min(i,c);if(u<=0)return;const d=this.particleSystem.geometry.attributes.position,p=this.particleSystem.geometry.attributes.velocity,g=this.particleSystem.geometry.attributes.startTime,E=this._dummy,_=[];for(let v=0;v<u;v++){const S=this.allocateInstance();if(S===-1)break;_.push(S);const U=a.feature?this.featureVisuals.get(a.feature):void 0,w=Math.min(1,(a.feature&&a.audioFeatures[a.feature]||0)*a.segmentIntensityBoost),T=1.5+w*2,m=a.origin.x+(Math.random()-.5)*T,x=a.origin.y+(Math.random()-.5)*T,R=a.origin.z+(Math.random()-.5)*T;E.position.set(m,x,R);const b=ft.PARTICLE_BASE_SIZE*((U==null?void 0:U.size)??1)*(.7+Math.random()*.6);if(E.scale.setScalar(b*(1+w*1.2)),E.updateMatrix(),this.particleInstancedMesh.setMatrixAt(S,E.matrix),this.instanceStartTimes&&this.instanceLifetimes){this.instanceStartTimes[S]=r;const N=(U==null?void 0:U.lifetime)??1.5;this.instanceLifetimes[S]=N+(Math.random()-.2)*N*.5}const P=S*3;d.array[P+0]=m,d.array[P+1]=x,d.array[P+2]=R,p.array[P+0]=0,p.array[P+1]=0,p.array[P+2]=0,g.array[S]=r;try{const N=this.particleInstancedMesh.geometry,O=N.getAttribute("instanceColor"),I=N.getAttribute("instanceSpeed"),y=N.getAttribute("instanceFeature"),M=N.getAttribute("instancePosition"),L=N.getAttribute("instanceScale");if(O){const F=S*3;let W=[.7,.7,.7];if(U){const te=.6+.4*Math.min(1,(a.feature&&a.audioFeatures[a.feature]||0)*a.segmentIntensityBoost);W=[U.color[0]*te,U.color[1]*te,U.color[2]*te]}else W=[.6+Math.random()*.4,.6+Math.random()*.4,.6+Math.random()*.4];O.array[F+0]=W[0],O.array[F+1]=W[1],O.array[F+2]=W[2],O.needsUpdate=!0}if(I&&(I.array[S]=.5+Math.random()*2,I.needsUpdate=!0),M&&(M.array[P+0]=m,M.array[P+1]=x,M.array[P+2]=R,M.needsUpdate=!0),L&&(L.array[S]=b,L.needsUpdate=!0),y){const F=a.feature==="subBass"?0:a.feature==="bass"?1:a.feature==="lowMid"?2:a.feature==="mid"?3:a.feature==="highMid"?4:a.feature==="treble"?5:a.feature==="sparkle"?6:1;y.array[S]=F,y.needsUpdate=!0}}catch{}}if(_.length!==0&&(this._frameSpawnCount+=_.length,d.needsUpdate=!0,p.needsUpdate=!0,g.needsUpdate=!0,this.particleInstancedMesh.instanceMatrix.needsUpdate=!0,_.length>0)){const v=Math.min(..._),S=v*3;d.updateRange={offset:S,count:_.length*3},p.updateRange={offset:S,count:_.length*3},g.updateRange={offset:v,count:_.length}}}spawnPointsBatch(i,a,r,o,c,u){if(!this.particleSystem)return;const d=this._maxFrameSpawns-this._frameSpawnCount,p=Math.min(i,d);if(p<=0)return;const g=this.particleSystem.geometry,E=g.attributes.position,_=g.attributes.velocity,v=g.attributes.startTime,S=this.particleBudget;if(S<=0||this.particleCursor+p>S&&(this.particleCursor=0,this.particleCursor+p>S))return;const U=this.particleCursor*3;for(let w=0;w<p;w++){const T=this.particleCursor+w,m=T*3,R=1.5+Math.min(1,(r&&o[r]||0)*c)*2;E.array[m+0]=a.x+(Math.random()-.5)*R,E.array[m+1]=a.y+(Math.random()-.5)*R,E.array[m+2]=a.z+(Math.random()-.5)*R,_.array[m+0]=0,_.array[m+1]=0,_.array[m+2]=0,v.array[T]=u}E.updateRange={offset:U,count:p*3},_.updateRange={offset:U,count:p*3},v.updateRange={offset:this.particleCursor,count:p},E.needsUpdate=!0,_.needsUpdate=!0,v.needsUpdate=!0,this.particleCursor+=p,this._frameSpawnCount+=p}allocateInstance(){if(!this.instanceFreeStack||this.instanceFreeStack.length===0)return-1;for(;this.instanceFreeStack.length>0;){const i=this.instanceFreeStack.pop();if(i<this.particleBudget)return i}return-1}registerConsciousParticle(i,a,r,o,c){var E;if(!this.synestheticSettings)return;const u=i||"sparkle",d=Math.max(0,Math.min(1,r*o)),p=((E=this.synestheticSettings)==null?void 0:E.lifespanSeconds)??4,g={id:this.consciousIdCounter++,featureKey:u,thoughtType:this.classifyThought(u),position:a.clone(),velocity:new le((Math.random()-.5)*.35,.05+Math.random()*.12,(Math.random()-.5)*.35),resonance:d,createdAt:c,lifespan:Math.max(.5,p*(.75+Math.random()*.5))};this.consciousParticles.push(g),this.consciousParticles.length>256&&this.consciousParticles.splice(0,this.consciousParticles.length-256)}freeInstance(i){this.instanceFreeStack||(this.instanceFreeStack=[]),this.instanceLifetimes&&(this.instanceLifetimes[i]=0),this.instanceStartTimes&&(this.instanceStartTimes[i]=0),i<this.particleBudget&&this.instanceFreeStack.push(i);try{if(this.particleInstancedMesh){const a=this.particleInstancedMesh.geometry,r=a.getAttribute("instancePosition"),o=a.getAttribute("instanceScale");if(r){const c=i*3;r.array[c+0]=0,r.array[c+1]=-9999,r.array[c+2]=0,r.needsUpdate=!0}o&&(o.array[i]=0,o.needsUpdate=!0)}}catch{}}}class nR{constructor(i,a,r){ie(this,"particles");ie(this,"scene");ie(this,"highQualityMode");this.scene=i,this.highQualityMode=a,this.particles=new tR(this.scene);const o=a?"high":"medium";this.particles.setQualityProfile(o),this.particles.setConsciousnessSettings(r)}seedAmbientParticles(i,a,r){if(!i)return;const o=Math.min(48,Math.max(18,Math.floor(a.length/4))),c=performance.now()/1e3,u=ft.GHOST_RIBBON_RADIUS*4.2;this.particles.seedAmbientField(i,o,u,c,r,.9)}async initGPU(i,a){await this.particles.initGPU(i,a)}update(i,a,r,o,c,u,d,p,g,E,_,v){this.particles.beginFrame();const S=performance.now()/1e3,U=this.particles.driveReactiveParticles({nowSeconds:S,deltaSeconds:i,cameraPosition:p,lookAtPosition:g,audioFeatures:a,segmentIntensityBoost:r,currentLOD:this.highQualityMode?"high":"low",gpuAudioForce:o},E);return this.particles.isGPUEnabled()&&this.particles.updateGPU(i,{audioFeatures:a,segmentIntensityBoost:r,gpuAudioForce:o,curlStrength:c,noiseScale:u,noiseSpeed:d}),this.particles.reclaimExpired(S),this.particles.updatePointsMaterial(a,r,_,v),U}registerFeatureVisual(i,a){this.particles.registerFeatureVisual(i,a)}spawnParticles(i,a,r,o,c){this.particles.spawnParticles(i,{origin:a,feature:r,audioFeatures:o??{},segmentIntensityBoost:c??1,nowSeconds:performance.now()/1e3})}spawnFeatureBurst(i,a,r,o,c){this.particles.spawnFeatureBurst(i,a,r,o,c,performance.now()/1e3)}applyShaderUniform(i,a){this.particles.applyShaderUniform(i,a)}getParticles(){return this.particles}dispose(){this.particles.dispose()}}class iR{constructor(i,a){ie(this,"trackMaterial");ie(this,"ghostRibbonMaterial");ie(this,"trackShaderUniforms",null);ie(this,"motionUniformsBound",!1);ie(this,"previousTrackModelViewMatrix",new Bn);ie(this,"hasPreviousModelViewMatrix",!1);this.trackMaterial=i,this.ghostRibbonMaterial=a,this.trackMaterial.onBeforeCompile=r=>{r.uniforms.trackTime={value:0},r.uniforms.pulseIntensity={value:0},r.uniforms.segmentBoost={value:1},r.uniforms.audioFlow={value:0},r.uniforms.ghostTintA={value:new at("#cfe9ff")},r.uniforms.ghostTintB={value:new at("#ffdff9")},r.uniforms.distortionStrength={value:0},r.uniforms.bassIntensity={value:0},r.uniforms.trebleIntensity={value:0},r.uniforms.rideSpeed={value:0},r.uniforms.motionBlur={value:0},r.uniforms.cameraDirection={value:new le},r.uniforms.previousModelViewMatrix={value:new Bn},r.uniforms.breathingStrength={value:0},r.uniforms.breathingRate={value:0},r.uniforms.spectralCentroid={value:0},r.uniforms.energy={value:0},r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
varying vec2 vUv;
varying vec3 vWorldPosition;
uniform float trackTime;
uniform float pulseIntensity;
uniform float segmentBoost;
uniform float audioFlow;
uniform vec3 ghostTintA;
uniform vec3 ghostTintB;
`).replace("vec3 totalEmissiveRadiance = emissive;",`float pathV = clamp(vUv.y, 0.0, 1.0);
float railCenterLine = abs(vUv.x - 0.5) * 2.0;
float railShine = smoothstep(0.35, 0.85, 1.0 - railCenterLine);
float loopWave = sin(pathV * 24.0 - trackTime * 5.5);
float traveler = smoothstep(0.05, 0.95, fract(pathV - trackTime * 0.35));
float spirit = pulseIntensity + audioFlow * 0.35 + segmentBoost * 0.2;
vec3 energyColorBase = mix(ghostTintA, ghostTintB, clamp(pathV + sin(trackTime * 3.0) * 0.08, 0.0, 1.0));
vec3 dreamTint = energyColorBase * (0.35 + 0.25 * traveler + 0.2 * max(loopWave, 0.0));
vec3 totalEmissiveRadiance = emissive + dreamTint * spirit;
`),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
varying vec2 vUv;
varying vec3 vWorldPosition;
uniform float trackTime;
uniform float distortionStrength;
uniform float bassIntensity;
uniform float trebleIntensity;
`).replace("#include <begin_vertex>",`#include <begin_vertex>
vUv = uv;
float vPath = clamp(uv.y, 0.0, 1.0);
transformed += normal * bassIntensity * 1.5;
float trebleWarp = sin(vPath * 60.0 - trackTime * 4.0) * trebleIntensity * 0.4;
transformed += normal * trebleWarp;
float motionRibbon = sin(vPath * 18.0 + trackTime * 2.0);
float ribbonIntensity = distortionStrength * (0.2 + 0.3 * motionRibbon);
transformed += normal * ribbonIntensity;
vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
`),this.trackShaderUniforms=r.uniforms,this.motionUniformsBound=!1}}update(i,a,r,o,c,u,d,p){if(this.trackShaderUniforms&&(this.updateUniformSafe(this.trackShaderUniforms.trackTime,i,.01),this.updateUniformSafe(this.trackShaderUniforms.pulseIntensity,a),this.updateUniformSafe(this.trackShaderUniforms.segmentBoost,r,.001),this.updateUniformSafe(this.trackShaderUniforms.audioFlow,Math.min(1.2,o*.25)),this.updateUniformSafe(this.trackShaderUniforms.distortionStrength,Math.min(.6,.2+a*.5+r*.1)),this.updateUniformSafe(this.trackShaderUniforms.bassIntensity,c.bass||0),this.updateUniformSafe(this.trackShaderUniforms.trebleIntensity,c.treble||0),this.updateUniformSafe(this.trackShaderUniforms.rideSpeed,u,.001),this.updateUniformSafe(this.trackShaderUniforms.motionBlur,Math.min(1,u*.12),.001),this.updateUniformSafe(this.trackShaderUniforms.breathingStrength,Math.min(.8,.1+r*.3)),this.updateUniformSafe(this.trackShaderUniforms.breathingRate,.5+(c.energy||0)*2),this.updateUniformSafe(this.trackShaderUniforms.spectralCentroid,c.spectralCentroid||0),this.updateUniformSafe(this.trackShaderUniforms.energy,c.energy||0)),this.ghostRibbonMaterial){const g=this.ghostRibbonMaterial.uniforms;this.updateUniformSafe(g.time,i,.01),this.updateUniformSafe(g.audioPulse,Math.min(1.8,a*1.1+o*.1)),this.updateColorUniformSafe(g.colorInner,d),this.updateColorUniformSafe(g.colorOuter,p)}}updateUniformSafe(i,a,r=.001){return i&&i.value!==void 0&&Math.abs(i.value-a)>r?(i.value=a,!0):!1}updateColorUniformSafe(i,a,r=.001){if(!i||!i.value)return!1;const o=i.value;if(o instanceof at)return o.equals(a)?!1:(o.copy(a),!0);if(o instanceof le){const c=Math.abs(o.x-a.r),u=Math.abs(o.y-a.g),d=Math.abs(o.z-a.b);return c>r||u>r||d>r?(o.set(a.r,a.g,a.b),!0):!1}return i.value=a.clone(),!0}}const aR={withStackTrace:!1},wm=(t,i,a=aR)=>{const r=i.isOk()?{type:"Ok",value:i.value}:{type:"Err",value:i.error},o=a.withStackTrace?new Error().stack:void 0;return{data:r,message:t,stack:o}};function ts(t,i,a,r){function o(c){return c instanceof a?c:new a(function(u){u(c)})}return new(a||(a=Promise))(function(c,u){function d(E){try{g(r.next(E))}catch(_){u(_)}}function p(E){try{g(r.throw(E))}catch(_){u(_)}}function g(E){E.done?c(E.value):o(E.value).then(d,p)}g((r=r.apply(t,[])).next())})}function qh(t){var i=typeof Symbol=="function"&&Symbol.iterator,a=i&&t[i],r=0;if(a)return a.call(t);if(t&&typeof t.length=="number")return{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(i?"Object is not iterable.":"Symbol.iterator is not defined.")}function Fi(t){return this instanceof Fi?(this.v=t,this):new Fi(t)}function kh(t,i,a){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r=a.apply(t,i||[]),o,c=[];return o=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),d("next"),d("throw"),d("return",u),o[Symbol.asyncIterator]=function(){return this},o;function u(S){return function(U){return Promise.resolve(U).then(S,_)}}function d(S,U){r[S]&&(o[S]=function(w){return new Promise(function(T,m){c.push([S,w,T,m])>1||p(S,w)})},U&&(o[S]=U(o[S])))}function p(S,U){try{g(r[S](U))}catch(w){v(c[0][3],w)}}function g(S){S.value instanceof Fi?Promise.resolve(S.value.v).then(E,_):v(c[0][2],S)}function E(S){p("next",S)}function _(S){p("throw",S)}function v(S,U){S(U),c.shift(),c.length&&p(c[0][0],c[0][1])}}function sR(t){var i,a;return i={},r("next"),r("throw",function(o){throw o}),r("return"),i[Symbol.iterator]=function(){return this},i;function r(o,c){i[o]=t[o]?function(u){return(a=!a)?{value:Fi(t[o](u)),done:!1}:c?c(u):u}:c}}function rR(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i=t[Symbol.asyncIterator],a;return i?i.call(t):(t=typeof qh=="function"?qh(t):t[Symbol.iterator](),a={},r("next"),r("throw"),r("return"),a[Symbol.asyncIterator]=function(){return this},a);function r(c){a[c]=t[c]&&function(u){return new Promise(function(d,p){u=t[c](u),o(d,p,u.done,u.value)})}}function o(c,u,d,p){Promise.resolve(p).then(function(g){c({value:g,done:d})},u)}}class xn{constructor(i){this._promise=i}static fromSafePromise(i){const a=i.then(r=>new vi(r));return new xn(a)}static fromPromise(i,a){const r=i.then(o=>new vi(o)).catch(o=>new Ln(a(o)));return new xn(r)}static fromThrowable(i,a){return(...r)=>new xn(ts(this,void 0,void 0,function*(){try{return new vi(yield i(...r))}catch(o){return new Ln(a?a(o):o)}}))}static combine(i){return oR(i)}static combineWithAllErrors(i){return lR(i)}map(i){return new xn(this._promise.then(a=>ts(this,void 0,void 0,function*(){return a.isErr()?new Ln(a.error):new vi(yield i(a.value))})))}andThrough(i){return new xn(this._promise.then(a=>ts(this,void 0,void 0,function*(){if(a.isErr())return new Ln(a.error);const r=yield i(a.value);return r.isErr()?new Ln(r.error):new vi(a.value)})))}andTee(i){return new xn(this._promise.then(a=>ts(this,void 0,void 0,function*(){if(a.isErr())return new Ln(a.error);try{yield i(a.value)}catch{}return new vi(a.value)})))}orTee(i){return new xn(this._promise.then(a=>ts(this,void 0,void 0,function*(){if(a.isOk())return new vi(a.value);try{yield i(a.error)}catch{}return new Ln(a.error)})))}mapErr(i){return new xn(this._promise.then(a=>ts(this,void 0,void 0,function*(){return a.isOk()?new vi(a.value):new Ln(yield i(a.error))})))}andThen(i){return new xn(this._promise.then(a=>{if(a.isErr())return new Ln(a.error);const r=i(a.value);return r instanceof xn?r._promise:r}))}orElse(i){return new xn(this._promise.then(a=>ts(this,void 0,void 0,function*(){return a.isErr()?i(a.error):new vi(a.value)})))}match(i,a){return this._promise.then(r=>r.match(i,a))}unwrapOr(i){return this._promise.then(a=>a.unwrapOr(i))}safeUnwrap(){return kh(this,arguments,function*(){return yield Fi(yield Fi(yield*sR(rR(yield Fi(this._promise.then(a=>a.safeUnwrap()))))))})}then(i,a){return this._promise.then(i,a)}[Symbol.asyncIterator](){return kh(this,arguments,function*(){const a=yield Fi(this._promise);return a.isErr()&&(yield yield Fi(sl(a.error))),yield Fi(a.value)})}}function sl(t){return new xn(Promise.resolve(new Ln(t)))}const Pm=t=>{let i=Ca([]);for(const a of t)if(a.isErr()){i=Oi(a.error);break}else i.map(r=>r.push(a.value));return i},oR=t=>xn.fromSafePromise(Promise.all(t)).andThen(Pm),Nm=t=>{let i=Ca([]);for(const a of t)a.isErr()&&i.isErr()?i.error.push(a.error):a.isErr()&&i.isOk()?i=Oi([a.error]):a.isOk()&&i.isOk()&&i.value.push(a.value);return i},lR=t=>xn.fromSafePromise(Promise.all(t)).andThen(Nm);var zu;(function(t){function i(o,c){return(...u)=>{try{const d=o(...u);return Ca(d)}catch(d){return Oi(c?c(d):d)}}}t.fromThrowable=i;function a(o){return Pm(o)}t.combine=a;function r(o){return Nm(o)}t.combineWithAllErrors=r})(zu||(zu={}));function Ca(t){return new vi(t)}function Oi(t){return new Ln(t)}class vi{constructor(i){this.value=i}isOk(){return!0}isErr(){return!this.isOk()}map(i){return Ca(i(this.value))}mapErr(i){return Ca(this.value)}andThen(i){return i(this.value)}andThrough(i){return i(this.value).map(a=>this.value)}andTee(i){try{i(this.value)}catch{}return Ca(this.value)}orTee(i){return Ca(this.value)}orElse(i){return Ca(this.value)}asyncAndThen(i){return i(this.value)}asyncAndThrough(i){return i(this.value).map(()=>this.value)}asyncMap(i){return xn.fromSafePromise(i(this.value))}unwrapOr(i){return this.value}match(i,a){return i(this.value)}safeUnwrap(){const i=this.value;return(function*(){return i})()}_unsafeUnwrap(i){return this.value}_unsafeUnwrapErr(i){throw wm("Called `_unsafeUnwrapErr` on an Ok",this,i)}*[Symbol.iterator](){return this.value}}class Ln{constructor(i){this.error=i}isOk(){return!1}isErr(){return!this.isOk()}map(i){return Oi(this.error)}mapErr(i){return Oi(i(this.error))}andThrough(i){return Oi(this.error)}andTee(i){return Oi(this.error)}orTee(i){try{i(this.error)}catch{}return Oi(this.error)}andThen(i){return Oi(this.error)}orElse(i){return i(this.error)}asyncAndThen(i){return sl(this.error)}asyncAndThrough(i){return sl(this.error)}asyncMap(i){return sl(this.error)}unwrapOr(i){return i}match(i,a){return a(this.error)}safeUnwrap(){const i=this.error;return(function*(){throw yield Oi(i),new Error("Do not use this generator out of `safeTry`")})()}_unsafeUnwrap(i){throw wm("Called `_unsafeUnwrap` on an Err",this,i)}_unsafeUnwrapErr(i){return this.error}*[Symbol.iterator](){const i=this;return yield i,i}}zu.fromThrowable;class cR{constructor(){ie(this,"handles",new Set);ie(this,"disposed",!1)}requestFrame(i){if(this.disposed)return 0;const a=requestAnimationFrame(r=>{this.handles.delete(a),this.disposed||i(r)});return this.handles.add(a),a}dispose(){this.disposed=!0,this.handles.forEach(i=>cancelAnimationFrame(i)),this.handles.clear()}}class tl extends Error{constructor(i){super(i),this.name="ValidationError"}}class uR{constructor(i,a,r){ie(this,"scene");ie(this,"camera");ie(this,"trackData");ie(this,"trackGeometryManager");ie(this,"particleSystemController");ie(this,"shaderUniformManager");ie(this,"animationFrameManager");ie(this,"trackMaterial");ie(this,"ghostRibbonMaterial");ie(this,"audioFeatures",{subBass:0,bass:0,lowMid:0,mid:0,highMid:0,treble:0,sparkle:0});ie(this,"trackPulse",0);ie(this,"segmentIntensityBoost",1);ie(this,"gpuAudioForce",0);ie(this,"rideSpeedSmoothed",0);ie(this,"lastUpdateSeconds",0);ie(this,"_forward",new le);ie(this,"_right",new le);ie(this,"_up",new le);ie(this,"_worldUp",new le(0,1,0));var S;this.scene=i,this.camera=r,this.trackData=a,this.animationFrameManager=new cR;const o=new at(a.railColor||"#ffffff"),c=new at(a.glowColor||"#00ffff"),u=new at("#e6f3ff"),d=new at("#ffe5ff");o.lerp(u,.35),c.lerp(d,.4),this.trackMaterial=new dS({color:o.clone(),emissive:c.clone(),emissiveIntensity:ft.BASS_GLOW_MIN,metalness:.15,roughness:.65,transparent:!0,opacity:ft.TRACK_DEFAULT_OPACITY,side:Rn});const p=o.clone().lerp(new at("#cfe9ff"),.5),g=c.clone().lerp(new at("#ffdff9"),.6);this.ghostRibbonMaterial=new rn({uniforms:{time:{value:0},audioPulse:{value:0},colorInner:{value:p},colorOuter:{value:g}},vertexShader:`varying float vPath;
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
}`,transparent:!0,depthWrite:!1,blending:qs,side:Rn});const E=this.analyzeAndSanitizePath(a.path);E.isErr()&&console.warn("[VisualEffectsOrchestrator] Issues found in track path:",E.error);const _={placeTrackUnderCamera:ft.PLACE_TRACK_UNDER_CAMERA,trackUnderCameraVerticalOffset:ft.TRACK_UNDER_CAMERA_VERTICAL_OFFSET,trackRadius:ft.TRACK_RADIUS,trackPathPoints:E.isOk()?E.value.points:[]};this.trackGeometryManager=new eR(i,a,this.trackMaterial,_);const v=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);this.particleSystemController=new nR(i,!v,((S=a.synesthetic)==null?void 0:S.particles)??null),this.shaderUniformManager=new iR(this.trackMaterial,this.ghostRibbonMaterial);try{this.timelineEvents=Array.isArray(a.events)?a.events.slice():[];for(const U of this.timelineEvents)U&&U.timestamp===void 0&&U.params&&U.params.audioSyncPoint&&(U.timestamp=U.params.audioSyncPoint);this.timelineEvents.sort((U,w)=>(U.timestamp||0)-(w.timestamp||0))}catch(U){console.error("[VisualEffectsOrchestrator] Failed to process timeline events:",U),this.timelineEvents=[]}}spawnEvent(i,a,r){const o=i.type,c=Math.max(.02,Math.min(1,a));switch(o){case"fireworks":{const u=3+Math.round(c*5);for(let d=0;d<u;d++){const p=new le((Math.random()-.5)*6,6+Math.random()*6,(Math.random()-.5)*6),g=new le().copy(r).add(p);this.particleSystemController.spawnFeatureBurst("sparkle",c*(.8+Math.random()*.6),g,this.audioFeatures,this.segmentIntensityBoost)}break}}}hasBoundsTree(i){var a;return"boundsTree"in i&&typeof((a=i.boundsTree)==null?void 0:a.closestPointToPoint)=="function"}analyzeAndSanitizePath(i){try{const a=[];if(!Array.isArray(i))return new Ln(new tl("Path must be an array"));const r=[];for(let o=0;o<i.length;o++){const c=i[o],u=this.validatePathPoint(c,o);if(u.isErr()){a.push(u.error.message);continue}r.push(u.value)}return r.length<2?new Ln(new tl("Path must contain at least 2 valid points")):new vi({points:r,issues:a})}catch(a){return new Ln(new tl(`Path analysis failed: ${a.message}`))}}validatePathPoint(i,a){const r=this.normalizePathPoint(i);return r?new vi(r):new Ln(new tl(`Invalid point at index ${a}`))}normalizePathPoint(i){if(!i)return null;if(i instanceof le)return Number.isFinite(i.x)&&Number.isFinite(i.y)&&Number.isFinite(i.z)?i.clone():null;if(typeof i=="object"){const{x:a,y:r,z:o}=i;if(Number.isFinite(a)&&Number.isFinite(r)&&Number.isFinite(o))return new le(a,r,o)}return null}removeDuplicatePoints(i,a=.01){if(i.length<=1)return i;const r=[i[0].clone()];for(let o=1;o<i.length;o++){const c=i[o],u=r[r.length-1];c.distanceTo(u)>a&&r.push(c.clone())}return r}async initGPU(i){await this.particleSystemController.initGPU(i,{})}update(i,a,r,o,c){const d=performance.now()/1e3,p=this.lastUpdateSeconds===0?1/60:Math.min(.25,Math.max(1/240,d-this.lastUpdateSeconds));this.lastUpdateSeconds=d;const g=Xt.clamp(c??0,0,1);try{const E=this.trackData&&this.trackData.audioFeatures&&typeof this.trackData.audioFeatures.duration=="number"?pS(this.trackData.audioFeatures.duration):0,_=E>0?g*E:0;this.handleTimelineEvents(_,p,r,o),this.lastAudioTimeSeconds=_}catch(E){console.error("[VisualEffectsOrchestrator] Error during timeline event handling:",E)}this.particleSystemController.update(d,p,r,this.audioFeatures,this.segmentIntensityBoost,this.gpuAudioForce),this.shaderUniformManager.update(i,this.trackPulse,this.segmentIntensityBoost,this.gpuAudioForce,this.audioFeatures,this.rideSpeedSmoothed)}handleTimelineEvents(i,a,r,o){if(!this.timelineEvents||!this.timelineEvents.length)return;const c=i;this._forward.subVectors(o,r).normalize(),this._right.crossVectors(this._forward,this._worldUp).normalize(),this._up.crossVectors(this._right,this._forward).normalize();for(let u=0;u<this.timelineEvents.length;u++){const d=this.timelineEvents[u];if(!d||typeof d.timestamp!="number")continue;const p=this.timelineTriggeredUntil.get(u)||0;if(c<=p)continue;const g=Math.max(.05,a*1.5);if(c+g>=d.timestamp){const E=Math.max(0,Math.min(1,(d.intensity??.6)*(this.segmentIntensityBoost||1))),_=new le().copy(r).addScaledVector(this._forward,8).addScaledVector(this._up,1.5);this.spawnEvent(d,E,_);const v=d.duration?typeof d.duration=="number"?d.duration:Number(d.duration):2;this.timelineTriggeredUntil.set(u,d.timestamp+v+.5)}}}dispose(){this.trackGeometryManager.dispose(),this.particleSystemController.dispose(),this.animationFrameManager.dispose()}}const fR=(t,i,a)=>{const r=St.useRef(null),o=St.useRef(null),c=St.useRef(!1);return St.useEffect(()=>{var u;if(!(!t||!i)){if((u=o.current)==null||u.dispose(),o.current=null,r.current=null,c.current=!1,console.log("[useRide] Track data is available. Building ride visuals..."),i.path.length>1){r.current=new Du(t.camera,i),o.current=new uR(t.scene,i,t.camera),console.log("[useRide] RideCamera and VisualEffectsOrchestrator created.");const d=t.renderer;o.current&&d&&!c.current&&(c.current=!0,o.current.initGPU(d).then(()=>console.log("[useRide] GPU particle system ready")).catch(p=>{const g=p instanceof Error?p.message:String(p);console.info("[useRide] GPU particle init skipped",g)}))}return()=>{var d;console.log("[useRide] Cleaning up ride visuals."),(d=o.current)==null||d.dispose(),o.current=null,r.current=null}}},[i,t,a]),{rideCameraRef:r,visualEffectsRef:o}},dR=(t,i)=>{St.useEffect(()=>{const a=t.current;if(!a)return;const E={"audiorailrider:frame":_=>{try{const v=_.detail;if(!v)return;const S=b=>Math.max(0,Math.min(1,b)),U=v.spectralFlux??0,w=v.spectralCentroid??0,T=v.energy??0,m=v.bass??0,x=v.mid??0,R=v.high??0;a.setAudioFeatures({subBass:S(m*.75),bass:S(m),lowMid:S(x*.85),mid:S(x),highMid:S(x*.4+R*.6),treble:S(R),sparkle:S(U*.6+w/6e3+T*.1)}),a.setAudioForce(T*2+U*1.5)}catch{}},"audiorailrider:dev:setCurlParams":_=>{const v=_.detail;v&&a.setCurlParams({curlStrength:v.curlStrength,noiseScale:v.noiseScale,noiseSpeed:v.noiseSpeed})},"audiorailrider:dev:applyUniform":_=>{const v=_.detail;v&&a.applyShaderUniform(v.name,v.value)},"audiorailrider:dev:loadUniformsManifest":async()=>{try{const _=await fetch("/shaders/shader-uniforms.json");if(!_.ok)return;const v=await _.json();a.setShaderUniformsFromManifest(v)}catch(_){console.error("[useGlobalEventListeners] Failed to load shader manifest:",_)}},"audiorailrider:dev:setTrackSettings":_=>{const v=_.detail;if(!v)return;typeof a.setTrackSettings=="function"&&a.setTrackSettings(v);const S=i.current;S&&typeof S.setTrackRadius=="function"&&typeof v.trackRadius=="number"&&S.setTrackRadius(v.trackRadius)},"audiorailrider:dev:forceTrackInside":_=>{const v=_.detail;v&&typeof a.forceTrackInside=="function"&&a.forceTrackInside(!!v.force)},"audiorailrider:dev:rebuildTrack":()=>{typeof a.rebuildTrackGeometry=="function"&&a.rebuildTrackGeometry()}};return console.log("[useGlobalEventListeners] Adding event listeners."),Object.entries(E).forEach(([_,v])=>{window.addEventListener(_,v)}),()=>{console.log("[useGlobalEventListeners] Removing event listeners."),Object.entries(E).forEach(([_,v])=>{window.removeEventListener(_,v)})}},[t,i])},pR=50,hR=(t,i,a,r,o,c,u)=>{const d=St.useRef(null);St.useEffect(()=>{if(t===zr.Idle||!i||!r||!o||!c){d.current&&(console.log("[useAnimationLoop] Stopping animation loop."),cancelAnimationFrame(d.current),d.current=null);return}console.log("[useAnimationLoop] Starting animation loop.");const p=new hS;let g=0,E=-1;const _=()=>{d.current=requestAnimationFrame(_);const v=p.getElapsedTime(),S=(a==null?void 0:a.currentTime)||0,U=a==null?void 0:a.duration,w=U&&isFinite(U)?U:i.path.length/pR,T=t===zr.Riding?S/w:v*.05%1;if(t===zr.Riding&&T>=1){u();return}if(t===zr.Riding){const m=Math.floor(T*20)/20;m!==E&&(E=m,console.log("[useAnimationLoop] Ride progress",{progress:Number(T.toFixed(3)),audioTime:Number(S.toFixed(2)),duration:Number(w.toFixed(2))}))}try{o.update(T);let m=null;if(i.frameAnalyses&&i.frameAnalyses.length>0){for(;g<i.frameAnalyses.length-1&&i.frameAnalyses[g].timestamp<S;)g++;m=i.frameAnalyses[g]}if(c.update(v,m,r.camera.position,o.lookAtPos,Math.max(0,Math.min(1,T))),m){const x={bass:m.bass,mid:m.mid,treble:m.high,energy:m.energy};r.updatePostProcessing(x)}r.render(p.getDelta())}catch(m){console.error("Error during animation frame:",m),d.current&&cancelAnimationFrame(d.current)}};return _(),()=>{d.current&&(cancelAnimationFrame(d.current),d.current=null)}},[t,i,a,r,o,c,u])},mR=({mountRef:t})=>{const i=ia(S=>S.status),a=ia(S=>S.blueprint),r=ia(S=>S.audioFeatures),o=ia(S=>S.trackData),c=ia(S=>S.audioFile),u=ia(S=>S.skyboxUrl),d=ia(S=>S.actions.handleRideFinish),p=JM(),g=Yx(t);Kx(a,r);const{audioRef:E}=mS({audioFile:c,status:i}),{rideCameraRef:_,visualEffectsRef:v}=fR(g.current,o,p);return dR(v,_),hR(i,o,E.current,g.current,_.current,v.current,d),St.useEffect(()=>{const S=g.current;if(!(!S||!u))try{console.log("[ThreeCanvasCore] Applying skybox from store",u),S.updateSkybox(u)}catch(U){console.warn("[ThreeCanvasCore] Failed to apply skybox from store",U)}},[u,g]),null},vR=()=>{const t=ia(a=>a.status),i=St.useRef(null);return ks.jsx("div",{ref:i,className:"fixed inset-0 z-10 w-full h-full",style:{opacity:t===zr.Riding?1:.5},children:ks.jsx(mR,{mountRef:i})})},TR=St.memo(vR);export{TR as default};

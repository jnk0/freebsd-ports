PORTNAME=	bulwark
DISTVERSION=	1.21.2
CATEGORIES=	mail www
MASTER_SITES=	https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-${_ESBUILD_VER}.tgz?dummy=/:esbuild
DISTFILES=	esbuild-freebsd-arm64-${_ESBUILD_VER}.tgz:esbuild

MAINTAINER=	jsi@jules.de
COMMENT=	Self-hosted JMAP webmail for Stalwart Mail Server
WWW=		https://bulwarkmail.org/

LICENSE=	AGPLv3
LICENSE_FILE=	${WRKSRC}/LICENSE

ONLY_FOR_ARCHS=	aarch64 amd64
ONLY_FOR_ARCHS_REASON=	esbuild ships FreeBSD binaries for aarch64 and amd64 only

USES=		cargo gmake nodejs:24,build,run npm:npm python:build
USE_GITHUB=	yes
GH_ACCOUNT=	bulwarkmail
GH_PROJECT=	webmail
GH_TUPLE=	parcel-bundler:lightningcss:v${_LCSS_VER}:lcss \
		tailwindlabs:tailwindcss:v${_OXIDE_VER}:oxide
USE_RC_SUBR=	bulwark

# The node modules archive is made by the framework at fetch time from the
# lockfiles in files/packagejsons: the upstream package.json and
# package-lock.json, and files/packagejsons/freebsd with the SWC WebAssembly
# bindings (Next.js has no native SWC for FreeBSD) and the fonts that
# next/font/google would download at build time. Update the upstream files
# and the @next/swc-wasm-nodejs version (same as next) on every update.
# The archive is fetched for x64 on every architecture, so that it has one
# checksum: the native modules of the build are made below for each.
NPM_FETCH_FLAGS+=	--cpu x64

# The native modules Tailwind CSS needs at build time have no FreeBSD
# binaries for aarch64, so they are built from source on all architectures:
# Tailwind oxide and lightningcss with cargo (the versions in the upstream
# package-lock.json; Makefile.crates merges the crates of both Cargo.lock
# files) and @parcel/watcher, which next-intl loads, with node-gyp. esbuild
# has binaries for both, the aarch64 one is not in the x64 archive.
CARGO_BUILD=	no
CARGO_CONFIGURE=	no
CARGO_INSTALL=	no
CARGO_TEST=	no
CARGO_VENDOR_DIR=	${WRKDIR}/cargo-crates

_ESBUILD_VER=	0.28.2
_LCSS_VER=	1.32.0
_OXIDE_VER=	4.3.3

# Commit of the release tag, shown in the About screen
BULWARK_COMMIT=	933bc18

MAKE_ENV=	BULWARK_BUILD_SEED=${DISTVERSION} \
		GIT_COMMIT=${BULWARK_COMMIT} \
		HOME=${WRKDIR} \
		NEXT_IGNORE_INCORRECT_LOCKFILE=1 \
		NEXT_TELEMETRY_DISABLED=1 \
		NEXT_TEST_WASM_DIR=${WRKSRC}/node_modules/@next/swc-wasm-nodejs \
		NODE_OPTIONS=--max-old-space-size=8192 \
		npm_config_python=${PYTHON_CMD}

SUB_FILES=	pkg-message
SUB_LIST=	GROUP=${WWWGRP} \
		USER=${WWWOWN}

_CARGO_BUILD=	${SETENVI} ${WRK_ENV} ${MAKE_ENV} ${CARGO_ENV} ${CARGO} build \
		--offline --release
_NODE_ARCH=	${ARCH:S/aarch64/arm64/:S/amd64/x64/}
_NODE_GYP=	${LOCALBASE}/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js
_MODULES=	${WRKSRC}/node_modules
_STANDALONE=	${WRKSRC}/.next/standalone

post-extract:
	@${MKDIR} ${_MODULES}/@next ${_MODULES}/@fontsource-variable
	${MV} ${WRKSRC}/freebsd/node_modules/@next/swc-wasm-nodejs \
		${_MODULES}/@next/
	${MV} ${WRKSRC}/freebsd/node_modules/@fontsource-variable/* \
		${_MODULES}/@fontsource-variable/
	@${RM} -r ${WRKSRC}/freebsd
	${MV} ${WRKDIR}/package ${_MODULES}/@esbuild/freebsd-arm64
# the prebuilt x64 modules give way to the ones built from source
	@${RM} -r ${_MODULES}/@parcel/watcher-freebsd-x64 \
		${_MODULES}/@tailwindcss/oxide-freebsd-x64 \
		${_MODULES}/lightningcss-freebsd-x64

post-patch:
	${INSTALL_DATA} ${FILESDIR}/freebsd-fonts.css ${WRKSRC}/app/
# As in the upstream Dockerfile: the mock JMAP server accepts any password
# and is for development only, and next build type-checks the unit tests,
# some of which import it.
	@${RM} -r ${WRKSRC}/app/api/dev-jmap
	@cd ${WRKSRC} && ${FIND} . -path ./node_modules -prune -o \
		\( -name __tests__ -o -name "*.test.ts" -o -name "*.test.tsx" \) \
		-prune -exec ${RM} -r {} +

pre-build:
# Tailwind oxide and lightningcss: their loaders try a binary next to their
# own code first
	@${MKDIR} ${WRKDIR}/.cargo
	@${PRINTF} '[source.crates-io]\nreplace-with = "vendored"\n[source.vendored]\ndirectory = "%s"\n' \
		${CARGO_VENDOR_DIR} > ${WRKDIR}/.cargo/config.toml
	cd ${WRKSRC_oxide} && ${_CARGO_BUILD} -p tailwind-oxide
	${INSTALL_LIB} ${CARGO_TARGET_DIR}/release/libtailwind_oxide.so \
		${_MODULES}/@tailwindcss/oxide/tailwindcss-oxide.freebsd-${_NODE_ARCH}.node
	cd ${WRKSRC_lcss} && ${_CARGO_BUILD} -p lightningcss_node
	${INSTALL_LIB} ${CARGO_TARGET_DIR}/release/liblightningcss_node.so \
		${_MODULES}/lightningcss/lightningcss.freebsd-${_NODE_ARCH}.node
# @parcel/watcher falls back to build/Release/watcher.node; gmake chokes on
# the MAKEFLAGS of make(1)
	cd ${_MODULES}/@parcel/watcher && ${SETENV} -u MAKEFLAGS -u MFLAGS \
		${MAKE_ENV} ${LOCALBASE}/bin/node ${_NODE_GYP} rebuild --release \
		--nodedir=${LOCALBASE}

do-build:
.for s in build-pst-worker build-store-worker build-plugin-sandbox
	cd ${WRKSRC} && ${SETENV} ${MAKE_ENV} ${LOCALBASE}/bin/node \
		scripts/${s}.mjs
.endfor
	cd ${WRKSRC} && ${SETENV} ${MAKE_ENV} ${LOCALBASE}/bin/node \
		node_modules/next/dist/bin/next build --webpack
	cd ${WRKSRC} && ${SETENV} ${MAKE_ENV} ${LOCALBASE}/bin/node \
		scripts/standalone-guard.mjs
# sharp loads its FreeBSD (WebAssembly) build at run time by a name the
# output file tracing may not follow
.for d in @emnapi @img
	if [ -d ${_MODULES}/${d} ]; then \
		cd ${_MODULES} && ${COPYTREE_SHARE} ${d} ${_STANDALONE}/node_modules; \
	fi
.endfor
	@${RM} -r ${_STANDALONE}/.next/cache ${_STANDALONE}/data

do-install:
	@${MKDIR} ${STAGEDIR}${WWWDIR}/.next ${STAGEDIR}${WWWDIR}/public \
		${STAGEDIR}${ETCDIR} ${STAGEDIR}/var/cache/bulwark
.for d in admin admin-state plugin-secrets settings telemetry version-check
	@${MKDIR} ${STAGEDIR}/var/db/bulwark/${d}
.endfor
	cd ${_STANDALONE} && ${COPYTREE_SHARE} . ${STAGEDIR}${WWWDIR}
	cd ${WRKSRC}/.next && ${COPYTREE_SHARE} static ${STAGEDIR}${WWWDIR}/.next
	cd ${WRKSRC}/public && ${COPYTREE_SHARE} . ${STAGEDIR}${WWWDIR}/public
	${LN} -s /var/db/bulwark ${STAGEDIR}${WWWDIR}/data
	${LN} -s /var/cache/bulwark ${STAGEDIR}${WWWDIR}/.next/cache
	${INSTALL_DATA} ${WRKSRC}/.env.example \
		${STAGEDIR}${ETCDIR}/bulwark.env.sample

post-install:
	@${FIND} ${STAGEDIR}${WWWDIR} -type f -name "*.map" -delete
	@${FIND} ${STAGEDIR}${WWWDIR} -type d -empty -delete
	@cd ${STAGEDIR}${PREFIX} && ${FIND} ${WWWDIR_REL} \
		\( -type f -or -type l \) | ${SORT} >> ${TMPPLIST}
	@${ECHO_CMD} "@sample(root,${WWWGRP},640) ${ETCDIR_REL}/bulwark.env.sample" \
		>> ${TMPPLIST}
	@${ECHO_CMD} "@dir(${WWWOWN},${WWWGRP},750) /var/cache/bulwark" >> ${TMPPLIST}
	@${ECHO_CMD} "@dir(${WWWOWN},${WWWGRP},750) /var/db/bulwark" >> ${TMPPLIST}
.for d in admin admin-state settings telemetry version-check
	@${ECHO_CMD} "@dir(${WWWOWN},${WWWGRP},750) /var/db/bulwark/${d}" >> ${TMPPLIST}
.endfor
	@${ECHO_CMD} "@dir(${WWWOWN},${WWWGRP},700) /var/db/bulwark/plugin-secrets" \
		>> ${TMPPLIST}

.include <bsd.port.mk>

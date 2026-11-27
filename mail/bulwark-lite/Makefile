PORTNAME=	bulwark-lite
DISTVERSION=	1.21.2
CATEGORIES=	mail www
MASTER_SITES=	https://github.com/bulwarkmail/webmail/releases/download/${DISTVERSION}/ \
		https://github.com/bulwarkmail/webmail/releases/download/${DISTVERSION}/bulwark-lite-stalwart.zip?dummy=/:stalwart
DISTFILES=	${DISTNAME}${EXTRACT_SUFX} \
		${_STALWART_DISTFILE}:stalwart
EXTRACT_ONLY=	${DISTNAME}${EXTRACT_SUFX}

MAINTAINER=	jsi@jules.de
COMMENT=	Static edition of the Bulwark JMAP webmail
WWW=		https://bulwarkmail.org/

LICENSE=	AGPLv3

USES=		zip
NO_ARCH=	yes
NO_BUILD=	yes
EXTRACT_AFTER_ARGS=	-d ${WRKSRC}

SUB_FILES=	bulwark-lite-stalwart pkg-message
SUB_LIST=	BUNDLE=${_STALWART_BUNDLE}

PORTDOCS=	LITE-README.md
PORTEXAMPLES=	Caddyfile.example nginx.conf.example

OPTIONS_DEFINE=	DOCS EXAMPLES

# Runtime configuration, edited by the administrator
_CONFIG_FILES=	config.json policy.json
# Files for other hosts (Netlify, Cloudflare Pages) and the documentation
_EXTRA_FILES=	_headers _redirects ${PORTDOCS} ${PORTEXAMPLES}

# Application bundle for Stalwart: upstream ships it under the same name for
# every release. bulwark-lite-stalwart merges it with the local files in
# ${ETCDIR}/stalwart into ${_STALWART_BUNDLE}, for Stalwart to load.
_STALWART_DISTFILE=	${PORTNAME}-stalwart-${DISTVERSION}${EXTRACT_SUFX}
_STALWART_BUNDLE=	/var/db/${PORTNAME}/${PORTNAME}-stalwart.zip

post-extract:
	${UNZIP_NATIVE_CMD} -p ${DISTDIR}/${_STALWART_DISTFILE} config.json | \
		${SED} -e '/"_comment"/s|: ".*"|: "Bulwark Lite for Stalwart. Edit, then run bulwark-lite-stalwart to rebuild ${_STALWART_BUNDLE}. An empty jmapServerUrl means the Stalwart server that serves this page."|' \
		> ${WRKDIR}/stalwart-config.json

do-install:
	@${MKDIR} ${STAGEDIR}${WWWDIR}
	cd ${WRKSRC} && ${COPYTREE_SHARE} . ${STAGEDIR}${WWWDIR}
.for f in ${_CONFIG_FILES}
	${MV} ${STAGEDIR}${WWWDIR}/${f} ${STAGEDIR}${WWWDIR}/${f}.sample
.endfor
	${RM} ${_EXTRA_FILES:S|^|${STAGEDIR}${WWWDIR}/|}
	@${MKDIR} ${STAGEDIR}${DATADIR} ${STAGEDIR}${ETCDIR}/stalwart \
		${STAGEDIR}${_STALWART_BUNDLE:H}
	${INSTALL_DATA} ${DISTDIR}/${_STALWART_DISTFILE} \
		${STAGEDIR}${DATADIR}/${PORTNAME}-stalwart.zip
	${INSTALL_DATA} ${WRKDIR}/stalwart-config.json \
		${STAGEDIR}${ETCDIR}/stalwart/config.json.sample
	${INSTALL_SCRIPT} ${WRKDIR}/bulwark-lite-stalwart \
		${STAGEDIR}${PREFIX}/sbin

do-install-DOCS-on:
	@${MKDIR} ${STAGEDIR}${DOCSDIR}
	${INSTALL_DATA} ${PORTDOCS:S|^|${WRKSRC}/|} ${STAGEDIR}${DOCSDIR}

do-install-EXAMPLES-on:
	@${MKDIR} ${STAGEDIR}${EXAMPLESDIR}
	${INSTALL_DATA} ${PORTEXAMPLES:S|^|${WRKSRC}/|} ${STAGEDIR}${EXAMPLESDIR}

post-install:
	@cd ${STAGEDIR}${PREFIX} && ${FIND} ${WWWDIR_REL} -type f \
		! -name "*.sample" | ${SORT} >> ${TMPPLIST}
.for f in ${_CONFIG_FILES}
	@${ECHO_CMD} "@sample ${WWWDIR_REL}/${f}.sample" >> ${TMPPLIST}
.endfor
	@${ECHO_CMD} "sbin/bulwark-lite-stalwart" >> ${TMPPLIST}
	@${ECHO_CMD} "${DATADIR_REL}/${PORTNAME}-stalwart.zip" >> ${TMPPLIST}
	@${ECHO_CMD} "@sample ${ETCDIR_REL}/stalwart/config.json.sample" >> ${TMPPLIST}
	@${ECHO_CMD} "@dir ${ETCDIR_REL}/stalwart" >> ${TMPPLIST}
	@${ECHO_CMD} "@dir ${_STALWART_BUNDLE:H}" >> ${TMPPLIST}
	@${ECHO_CMD} "@postexec %D/sbin/bulwark-lite-stalwart" >> ${TMPPLIST}
	@${ECHO_CMD} "@postunexec rm -f ${_STALWART_BUNDLE}" >> ${TMPPLIST}

.include <bsd.port.mk>

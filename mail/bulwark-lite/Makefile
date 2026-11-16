PORTNAME=	bulwark-lite
DISTVERSION=	1.21.2
CATEGORIES=	mail www
MASTER_SITES=	https://github.com/bulwarkmail/webmail/releases/download/${DISTVERSION}/

MAINTAINER=	jsi@jules.de
COMMENT=	Static edition of the Bulwark JMAP webmail
WWW=		https://bulwarkmail.org/

LICENSE=	AGPLv3

USES=		zip
NO_ARCH=	yes
NO_BUILD=	yes
EXTRACT_AFTER_ARGS=	-d ${WRKSRC}

SUB_FILES=	pkg-message

PORTDOCS=	LITE-README.md
PORTEXAMPLES=	Caddyfile.example nginx.conf.example

OPTIONS_DEFINE=	DOCS EXAMPLES

# Runtime configuration, edited by the administrator
_CONFIG_FILES=	config.json policy.json
# Files for other hosts (Netlify, Cloudflare Pages) and the documentation
_EXTRA_FILES=	_headers _redirects ${PORTDOCS} ${PORTEXAMPLES}

do-install:
	@${MKDIR} ${STAGEDIR}${WWWDIR}
	cd ${WRKSRC} && ${COPYTREE_SHARE} . ${STAGEDIR}${WWWDIR}
.for f in ${_CONFIG_FILES}
	${MV} ${STAGEDIR}${WWWDIR}/${f} ${STAGEDIR}${WWWDIR}/${f}.sample
.endfor
	${RM} ${_EXTRA_FILES:S|^|${STAGEDIR}${WWWDIR}/|}

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

.include <bsd.port.mk>

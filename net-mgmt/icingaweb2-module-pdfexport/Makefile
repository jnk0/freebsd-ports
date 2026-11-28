PORTNAME=	icingaweb2-module-pdfexport
DISTVERSIONPREFIX=	v
DISTVERSION=	0.13.0
CATEGORIES=	net-mgmt www
PKGNAMESUFFIX=	${PHP_PKGNAMESUFFIX}

MAINTAINER=	ports@FreeBSD.org
COMMENT=	Icinga PDF Export
WWW=		https://github.com/Icinga/icingaweb2-module-pdfexport

LICENSE=	GPLv3+
LICENSE_FILE=	${WRKSRC}/LICENSE.md

RUN_DEPENDS=	icingaweb2${PHP_PKGNAMESUFFIX}>=2.12.5:net-mgmt/icingaweb2@${PHP_FLAVOR} \
		icinga-php-library${PHP_PKGNAMESUFFIX}>=1.0.0:net-mgmt/icinga-php-library@${PHP_FLAVOR} \
		icinga-php-thirdparty${PHP_PKGNAMESUFFIX}>=1.0.0:net-mgmt/icinga-php-thirdparty@${PHP_FLAVOR} \
		chromium>0:www/chromium

USES=		php:web,flavors
IGNORE_WITH_PHP=		86

USE_GITHUB=	yes
GH_ACCOUNT=	icinga

NO_BUILD=	yes
NO_ARCH=	yes

WWWDIR?=	${PREFIX}/www/icingaweb2/modules/${PORTNAME:C/^.*-//}

post-patch:
	@${REINPLACE_CMD} -e "s|/bin/google-chrome|${LOCALBASE}/bin/chrome|" \
		${WRKSRC}/library/Pdfexport/ProvidedHook/Pdfexport.php
do-install:
	@${MKDIR} ${STAGEDIR}${WWWDIR}
	(cd ${WRKSRC} && \
		${COPYTREE_SHARE} . ${STAGEDIR}${WWWDIR})

.include <bsd.port.mk>

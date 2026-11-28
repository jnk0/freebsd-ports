PORTNAME=	icingaweb2-module-x509
DISTVERSIONPREFIX=	v
DISTVERSION=	1.4.0
CATEGORIES=	net-mgmt www
PKGNAMESUFFIX=	${PHP_PKGNAMESUFFIX}

MAINTAINER=	gettoknowmi@yahoo.com
COMMENT=	Automates certificate monitoring with Icinga
WWW=		https://github.com/Icinga/icingaweb2-module-x509

LICENSE=	GPLv3+
LICENSE_FILE=	${WRKSRC}/LICENSE.md

RUN_DEPENDS=	icinga-php-library${PHP_PKGNAMESUFFIX}>=1.0.0:net-mgmt/icinga-php-library@${PHP_FLAVOR} \
		icinga-php-thirdparty${PHP_PKGNAMESUFFIX}>=1.0.0:net-mgmt/icinga-php-thirdparty@${PHP_FLAVOR} \
		icingaweb2${PHP_PKGNAMESUFFIX}>=2.12.5:net-mgmt/icingaweb2@${PHP_FLAVOR}

USES=		mysql:server php:web,flavors ssl
IGNORE_WITH_PHP=	86

USE_GITHUB=	yes
GH_ACCOUNT=	Icinga

USE_PHP=	gmp

NO_BUILD=	yes
NO_ARCH=	yes

WWWDIR?=	${PREFIX}/www/icingaweb2/modules/${PORTNAME:C/^.*-//}

do-install:
	@${MKDIR} ${STAGEDIR}${WWWDIR}
	(cd ${WRKSRC} && \
		${COPYTREE_SHARE} . ${STAGEDIR}${WWWDIR})

.include <bsd.port.mk>

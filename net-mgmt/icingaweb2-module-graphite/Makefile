PORTNAME=	icingaweb2-module-graphite
DISTVERSIONPREFIX=	v
DISTVERSION=	1.3.1
CATEGORIES=	net-mgmt www
PKGNAMESUFFIX=	${PHP_PKGNAMESUFFIX}

MAINTAINER=	ports@FreeBSD.org
COMMENT=	Graphite integration into Icinga Web 2
WWW=		https://github.com/Icinga/icingaweb2-module-graphite

LICENSE=	GPLv3+
LICENSE_FILE=	${WRKSRC}/LICENSE.md

RUN_DEPENDS=	icingaweb2${PHP_PKGNAMESUFFIX}>=2.12.5:net-mgmt/icingaweb2@${PHP_FLAVOR} \
		icinga-php-library${PHP_PKGNAMESUFFIX}>=0.19.0:net-mgmt/icinga-php-library@${PHP_FLAVOR} \
		icinga-php-thirdparty${PHP_PKGNAMESUFFIX}>=0.15.0:net-mgmt/icinga-php-thirdparty@${PHP_FLAVOR}

USES=		php:web,flavors
IGNORE_WITH_PHP=	86

USE_GITHUB=	yes
GH_ACCOUNT=	icinga

NO_BUILD=	yes
NO_ARCH=	yes

WWWDIR?=	${PREFIX}/www/icingaweb2/modules/${PORTNAME:C/^.*-//}

do-install:
	@${MKDIR} ${STAGEDIR}${WWWDIR}
	(cd ${WRKSRC} && \
		${COPYTREE_SHARE} . ${STAGEDIR}${WWWDIR})

.include <bsd.port.mk>

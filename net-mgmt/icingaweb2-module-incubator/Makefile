PORTNAME=	icingaweb2-module-incubator
DISTVERSIONPREFIX=	v
DISTVERSION=	0.23.0
CATEGORIES=	net-mgmt www
PKGNAMESUFFIX=	${PHP_PKGNAMESUFFIX}

MAINTAINER=	gettoknowmi@yahoo.com
COMMENT= 	Incubator provides bleeding-edge libraries
WWW=		https://github.com/Icinga/icingaweb2-module-incubator

LICENSE=	MIT
LICENSE_FILE=	${WRKSRC}/LICENSE

RUN_DEPENDS=	icinga-php-library${PHP_PKGNAMESUFFIX}>=0.13.1:net-mgmt/icinga-php-library@${PHP_FLAVOR} \
		icinga-php-thirdparty${PHP_PKGNAMESUFFIX}>=0.12.1:net-mgmt/icinga-php-thirdparty@${PHP_FLAVOR}

USES=		cpe php:web,flavors

CPE_VENDOR=	icinga

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

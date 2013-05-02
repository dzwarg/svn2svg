<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html"/>
<xsl:template match="/log">
    <html>
	<head>
	<link rel="stylesheet" type="text/css" href="css/svnlog.css"/>
	<script src="js/raphael.js" type="text/javascript"></script>
	<script src="js/svnlog.js" type="text/javascript"></script>
	<script type="text/javascript">
		var json = [
		<xsl:apply-templates select="logentry" />
];
	</script>
	</head>
	<body onload="init();">
		<div id="canvas"></div>
		<div id="log"></div>
	</body>
	</html>
</xsl:template>

<xsl:template match="logentry">
		{
			revision:<xsl:value-of select="@revision"/>,
			msg:'<xsl:call-template name="nobreak">
						 <xsl:with-param name="msg" select="string(msg)"/>
					 </xsl:call-template>',
			author:'<xsl:value-of select="author"/>',
			date:'<xsl:value-of select="date"/>',
			paths:[
				<xsl:apply-templates select="paths/path"/>
			]
		}<xsl:if test="position()&lt;count(../logentry)">,
</xsl:if>
</xsl:template>

<xsl:template match="paths/path">
				{
					path:'<xsl:value-of select="."/>',
					action:'<xsl:value-of select="@action"/>'
				}<xsl:if test="position()&lt;count(../path)">,</xsl:if>
</xsl:template>

<xsl:template name="nobreak">
	<xsl:param name="msg"/>
	<xsl:choose>
		<xsl:when test="contains($msg,'&#10;')">
			<xsl:variable name="msg0" select="substring-before($msg,'&#10;')" />
			<xsl:variable name="msg1" select="substring($msg,string-length($msg0)+2)" />
			<xsl:call-template name="nobreak">
				<xsl:with-param name="msg" select="concat($msg0,$msg1)"/>
			</xsl:call-template>
		</xsl:when>
		<xsl:when test='contains($msg,"&apos;")'>
			<xsl:variable name="msg0" select='substring-before($msg,"&apos;")' />
			<xsl:variable name="msg1" select="substring($msg,string-length($msg0)+2)" />
			<xsl:call-template name="nobreak">
				<xsl:with-param name="msg" select='concat($msg0,"&amp;apos;",$msg1)'/>
			</xsl:call-template>
		</xsl:when>
		<xsl:otherwise>
			<xsl:value-of select="$msg"/>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>
</xsl:stylesheet>

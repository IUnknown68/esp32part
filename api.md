## Functions

<dl>
<dt><a href="#parseEnum">parseEnum(value, enumType)</a> ⇒ <code>T</code></dt>
<dd><p>Typesafe parsing of a number into an enum.</p></dd>
<dt><a href="#parseType">parseType(value)</a> ⇒ <code>PartitionType</code></dt>
<dd><p>Enum parser for <code>PartitionType</code></p></dd>
<dt><a href="#parseSubtypeApp">parseSubtypeApp(value)</a> ⇒ <code>PartitionSubTypeApp</code></dt>
<dd><p>Enum parser for <code>PartitionSubTypeApp</code></p></dd>
<dt><a href="#parseSubtypeData">parseSubtypeData(value)</a> ⇒ <code>PartitionSubTypeData</code></dt>
<dd><p>Enum parser for <code>PartitionSubTypeData</code></p></dd>
<dt><a href="#parseFlag">parseFlag(value)</a> ⇒ <code><a href="#parseFlag">parseFlag</a></code></dt>
<dd><p>Enum parser for <code>parseFlag</code></p></dd>
<dt><a href="#parseNumber">parseNumber(value)</a> ⇒ <code>number</code></dt>
<dd><p>Parses a number as it can appear in a partition table csv. Takes into account
suffixes (K, M) and the prefix <code>0x</code> for hex numbers.</p></dd>
<dt><a href="#csvRowToPartition">csvRowToPartition(line)</a> ⇒ <code>PartitionRecord</code></dt>
<dd><p>Parses a single csv-row into a <code>PartitionRecord</code>. If the line is not a partition
(like a comment), returns <code>null</code>.</p></dd>
<dt><a href="#csvToPartitionList">csvToPartitionList(line)</a> ⇒ <code>Array.&lt;PartitionRecord&gt;</code></dt>
<dd><p>Parses a csv-file into an <code>Array</code> of <code>PartitionRecord</code>s.</p></dd>
</dl>

<a name="parseEnum"></a>

## parseEnum(value, enumType) ⇒ <code>T</code>
<p>Typesafe parsing of a number into an enum.</p>

**Kind**: global function  
**Returns**: <code>T</code> - <p>A valid enum of type <code>T</code>.</p>  
**Throws**:

- <code>TypeError</code> <p>If the value can not be parsed as <code>T</code>.</p>


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | <p>String value to parse.</p> |
| enumType | <code>Object</code> | <p>The enum type as an Object.</p> |

<a name="parseType"></a>

## parseType(value) ⇒ <code>PartitionType</code>
<p>Enum parser for <code>PartitionType</code></p>

**Kind**: global function  
**Returns**: <code>PartitionType</code> - <p>A valid enum of type <code>PartitionType</code>.</p>  
**Throws**:

- <code>TypeError</code> <p>If the value can not be parsed as <code>PartitionType</code>.</p>


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | <p>String value to parse.</p> |

<a name="parseSubtypeApp"></a>

## parseSubtypeApp(value) ⇒ <code>PartitionSubTypeApp</code>
<p>Enum parser for <code>PartitionSubTypeApp</code></p>

**Kind**: global function  
**Returns**: <code>PartitionSubTypeApp</code> - <p>A valid enum of type <code>PartitionSubTypeApp</code>.</p>  
**Throws**:

- <code>TypeError</code> <p>If the value can not be parsed as <code>PartitionSubTypeApp</code>.</p>


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | <p>String value to parse.</p> |

<a name="parseSubtypeData"></a>

## parseSubtypeData(value) ⇒ <code>PartitionSubTypeData</code>
<p>Enum parser for <code>PartitionSubTypeData</code></p>

**Kind**: global function  
**Returns**: <code>PartitionSubTypeData</code> - <p>A valid enum of type <code>PartitionSubTypeData</code>.</p>  
**Throws**:

- <code>TypeError</code> <p>If the value can not be parsed as <code>PartitionSubTypeData</code>.</p>


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | <p>String value to parse.</p> |

<a name="parseFlag"></a>

## parseFlag(value) ⇒ [<code>parseFlag</code>](#parseFlag)
<p>Enum parser for <code>parseFlag</code></p>

**Kind**: global function  
**Returns**: [<code>parseFlag</code>](#parseFlag) - <p>A valid enum of type <code>parseFlag</code>.</p>  
**Throws**:

- <code>TypeError</code> <p>If the value can not be parsed as <code>parseFlag</code>.</p>


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | <p>String value to parse.</p> |

<a name="parseNumber"></a>

## parseNumber(value) ⇒ <code>number</code>
<p>Parses a number as it can appear in a partition table csv. Takes into account
suffixes (K, M) and the prefix <code>0x</code> for hex numbers.</p>

**Kind**: global function  
**Returns**: <code>number</code> - <p>Parsed number.</p>  
**Throws**:

- <code>TypeError</code> 


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | <p>Value to parse.</p> |

<a name="csvRowToPartition"></a>

## csvRowToPartition(line) ⇒ <code>PartitionRecord</code>
<p>Parses a single csv-row into a <code>PartitionRecord</code>. If the line is not a partition
(like a comment), returns <code>null</code>.</p>

**Kind**: global function  
**Returns**: <code>PartitionRecord</code> - <p>Parsed record. <code>null</code> for empty lines or comments.</p>  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| line | <code>string</code> | <p>CSV-String</p> |

<a name="csvToPartitionList"></a>

## csvToPartitionList(line) ⇒ <code>Array.&lt;PartitionRecord&gt;</code>
<p>Parses a csv-file into an <code>Array</code> of <code>PartitionRecord</code>s.</p>

**Kind**: global function  
**Returns**: <code>Array.&lt;PartitionRecord&gt;</code> - <p>Parsed records.</p>  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| line | <code>string</code> | <p>CSV</p> |


export function hasOwn<ObjectType, Property extends string>(
  obj: ObjectType,
  property: Property,
): obj is ObjectType & { [Key in Property]: any } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.prototype.hasOwnProperty.call(obj, property)
  )
}

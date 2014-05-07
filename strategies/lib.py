def array(dimension, value_getter):
    if (len(dimension) == 0):
        return value_getter()

    ret = []
    for i in range(dimension[0]):
        ret.append(array(dimension[1:], value_getter))
    return ret

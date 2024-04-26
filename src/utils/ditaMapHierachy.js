function createDitaMapHierarchy(topicWise) {
    // Assuming topicWise is an array of objects with 'title' and 'content'
    // properties representing each topic
    const hierarchy = {};

    topicWise.forEach(topic => {
        let currentNode = hierarchy;
        const titleParts = topic.title.split('/');
        titleParts.forEach(part => {
            currentNode[part] = currentNode[part] || {};
            currentNode = currentNode[part];
        });
        currentNode.topic = topic; // Store the topic content at the leaf node
    });

    return hierarchy;
}




module.exports=createDitaMapHierarchy